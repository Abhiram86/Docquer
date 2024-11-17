from fastapi import APIRouter
from fastapi.responses import JSONResponse
from db import MongoDB
from models.User import User, LoginRequest, UpdateUser
from bson import ObjectId
import bcrypt

router = APIRouter()
db = MongoDB()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/register")
async def register(user: User):
    existing_user = await db.find("users", {"email": user.email})
    if existing_user and user.GoogleRegister:
        existing_user[0]['_id'] = str(existing_user[0]['_id'])
        return {'data': existing_user[0]}
    if existing_user:
        return JSONResponse(status_code=400, content={"error": "Username already exists"})
    else:
        user_data = user.model_dump()
        user_data["convos"] = []
        if not user.GoogleRegister:
            user_data["password"] = hash_password(user_data["password"])
        new_user = {k: v for k, v in user_data.items() if k != 'password' and k != 'GoogleRegister'}
        await db.insert("users", new_user)
        return {"message": "success"}
    
@router.post("/login")
async def login(req: LoginRequest):
    user = await db.find("users", {
        'email': req.email
    })

    if len(user) == 0 and not req.GoogleLogin:
        return JSONResponse(status_code=404, content={"error": "Could'nt find the user"})
    elif len(user) == 0 and req.GoogleLogin:
       user_data = req.model_dump()
       user_data['convos'] = []
       new_user = {k: v for k, v in user_data.items() if k != 'password' and k != 'GoogleRegister'}
       id = await db.insert("users", new_user)
       new_user['_id'] = str(id)
       return {"data": new_user}

    user[0]['_id'] = str(user[0]['_id'])

    user = {k: v for k, v in user[0].items() if k != 'groq_api_key' and k != 'GoogleLogin'}
    
    if req.GoogleLogin:
        return {"data": user}
    
    if not verify_password(req.password, user[0]["password"]):
        return JSONResponse(status_code=400, content={"error": "Passwords doesnt match"})
    
    return {"data": user}

@router.post("/update")
async def update(req: UpdateUser):
    user = await db.find("users", {"_id": ObjectId(req.id)})

    if user:
        api_key = user[0]['groq_api_key']
        await db.update(name="users", query={"_id": ObjectId(req.id)}, update_data={
            "$set": {
            "username": req.username,
            "email": req.email,
            "groq_api_key": req.groq_api_key if len(req.groq_api_key) > 0 else api_key
        }})
        return {"message": "succesfull"}
    
    return JSONResponse(status_code=404, content={"error": "User not found"})
