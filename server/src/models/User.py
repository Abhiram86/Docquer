from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    username: str
    email: EmailStr
    password: Optional[str] = None
    groq_api_key: str
    GoogleRegister: bool

class LoginRequest(BaseModel):
    email: str
    username: Optional[str] = None
    password: Optional[str] = None
    GoogleLogin: bool

class UpdateGroq(BaseModel):
    id: str
    key: str

class UpdateUser(BaseModel):
    id: str
    username: str
    email: str
    groq_api_key: str