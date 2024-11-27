from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse
from db import MongoDB
from models.User import UpdateGroq
from models.Chat import NormalChat, NewChat, GetConvos, GetMessages, FileChat, GetConvDetails, DeleteConversatoin, UploadLink
from bson import ObjectId
from llm.model import normal_chat, title_recommender, subtitle_recommender, file_chat, create_index, replace_index, delete_index, get_link_data, get_youtube_transcript, update_index, normal_chat_stream
from datetime import datetime
from pydantic import BaseModel
from typing import List

bucket_name = "docquer_bucket"

router = APIRouter()
db = MongoDB()

@router.post("/update-groq")
async def update_api_key(req: UpdateGroq):
    print(req)
    user = await db.find("users", {"_id": ObjectId(req.id)})
    if user and req.id:
        await db.update(
            name="users",
            query={'_id': ObjectId(req.id)},
            update_data={"$set": {"groq_api_key": req.key}}
        )
        return {"message": "success"}
    else:
        raise JSONResponse(content={"error": "User not found"}, status_code=404)
    
@router.post("/normal-chat")
async def normal(req: NormalChat):
    messages = await db.find_by_ids("Message", req.messageIds)
    user = await db.find("users", {'username': req.username})
    api_key = user[0]['groq_api_key']
    res = normal_chat(req.username, api_key, req.query, messages)
    if res.get('error'):
        return JSONResponse(content={"error":"Something went wrong check the api"}, status_code=400)
    user_msg_id = await db.insert("Message", {"sender": "user", "text": req.query, "createTime": datetime.now()})
    res = res['message']
    bot_msg_id = await db.insert("Message", {"sender": "bot", "text": res.content})
    if len(messages) == 0:
        title = title_recommender(api_key, req.query)
        sub_title = subtitle_recommender(api_key, title, req.query)
        await db.update("convos", {"_id": ObjectId(req.conv_id)}, {
            "$set": {
            "firstMessage": req.query,
            "title": title,
            "subTitle": sub_title
        }})
    await db.update("convos", {"_id": ObjectId(req.conv_id)}, {
        "$push": {
            "messages": {
                "$each": [str(user_msg_id), str(bot_msg_id)]
            }
        }
    })
    return {"response": res, "messageIds": [str(user_msg_id), str(bot_msg_id)]}

@router.post("/normal-chat-stream")
def normal_chat_stream_endpoint(req: NormalChat):
    messages = db.find_by_ids("Message", req.messageIds)
    user = db.find("users", {'username': req.username})
    api_key = user[0]['groq_api_key']
    # res = normal_chat(req.username, api_key, req.query, messages)
    # if res.get('error'):
    #     return JSONResponse(content={"error":"Something went wrong check the api"}, status_code=400)
    async def generate():
        for token in normal_chat_stream(req.username, req.query, api_key, messages):
            yield f"data: {json.dumps({'data': token})}\n\n"
        yield "data: [DONE]\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.post("/upload-file")
async def upload(file: UploadFile = File(...), conv_id: str = Form(...)):
    try:
        file_cont = await file.read()
        create_index(file_cont, file.content_type, conv_id)

        await db.update("convos", {"_id": ObjectId(conv_id)}, {"$set": {"fileName": file.filename, "fileMime": file.content_type}})
        return {"message": "success"}
    except Exception as e:
        print(e)
        return JSONResponse(content={"error": "error reading file"}, status_code=400)

@router.post("/replace-file")
async def replace_file(file: UploadFile = File(...), conv_id: str = Form(...)):
    try:
        file_cont = await file.read()
        replace_index(file_cont, file.content_type, conv_id)

        await db.update("convos", {"_id": ObjectId(conv_id)}, {
            "$set": {
                "fileName": file.filename,
                "fileMime": file.content_type
            }
        })
        
        return {"message": "success"}
    except Exception as e:
        print(e)
        return JSONResponse(content={"error": "error replacing file"}, status_code=400)

@router.post("/file-chat")
async def chat_with_file(req: FileChat):
    messages = await db.find_by_ids("Message", req.messageIds)
    user = await db.find("users", {'username': req.username})

    res = file_chat(user[0]['groq_api_key'], req.username, req.query, req.conv_id, messages)
    if res.get('error'):
        return JSONResponse(content={"error": res['error']}, status_code=400)
    res = res['message']

    if len(res.content) > 0:
        user_msg_id = await db.insert("Message", {
            "sender": "user",
            "text": req.query,
            "createTime": datetime.now()
        })
        bot_msg_id = await db.insert("Message", {
            "sender": "bot",
            "text": res.content
        })
        await db.update("convos", {"_id": ObjectId(req.conv_id)}, {
            "$push": {
            "messages": {
                "$each": [str(user_msg_id), str(bot_msg_id)]
            }
        }})
        return {"response": res, "messageIds": [str(user_msg_id), str(bot_msg_id)]}
    
    return JSONResponse(content={"error": "got empty response"}, status_code=400)
    
@router.post("/new-chat")
async def new_chat(req: NewChat):
    fileName = None if len(req.fileName) == 0 else req.fileName
    fileMime = None if len(req.fileMime) == 0 else req.fileMime

    user = await db.find("users", {'username': req.username})
    api_key = user[0]['groq_api_key']

    new_title = title_recommender(api_key, req.firstMessage) if len(req.firstMessage) != 0 else "About " + req.fileName
    new_subtitle = subtitle_recommender(api_key, new_title, req.firstMessage) if len(req.firstMessage) != 0 else "nothing mentioned"
    
    title = req.title if len(new_title) > 18 else new_title
    subtitle = "nothing mentioned" if len(new_subtitle) > 36 else new_subtitle

    res2 = await db.insert("convos", {
        "username": req.username,
        "fileName": fileName,
        "title": title,
        "fileMime": fileMime,
        "subTitle": subtitle,
        "firstMessage": req.firstMessage,
        "createTime": datetime.now(),
        "messages": []
    })

    await db.update("users", {"username": req.username}, {"$push": {"convos": str(res2)}})
    return {"id": str(res2)}

@router.post("/get-convos")
async def get_convos(req: GetConvos):
    convs = await db.find_by_ids("convos", req.ids)
    return {"convos": convs}

@router.post("/get-messages")
async def get_messages(req: GetMessages):
    if req.id == "new":
        try:
            user = await db.find("users", {'_id': ObjectId(req.userId)})
            if not user:
                return JSONResponse(
                    content={"error": "User not found"},
                    status_code=404
                )
            api_status = True if len(user[0]['groq_api_key']) > 0 else False
            return {"messages": None, "file": None, "api_status": api_status, "linkUploaded": False}
        except Exception as e:
            print(f"Error in get_messages for new conversation: {str(e)}")
            return JSONResponse(
                content={"error": "Failed to get user information"},
                status_code=500
            )
        
    try:
        # Validate conversation ID
        if not ObjectId.is_valid(req.id):
            return JSONResponse(
                content={"error": "Invalid conversation ID"},
                status_code=400
            )
            
        conv = await db.find("convos", {"_id": ObjectId(req.id)})
        user = await db.find("users", {'_id': ObjectId(req.userId)})
        
        if not user:
            return JSONResponse(
                content={"error": "User not found"},
                status_code=404
            )
            
        api_status = True if len(user[0]['groq_api_key']) > 0 else False
        
        if not conv or len(conv) == 0:
            return JSONResponse(
                content={"error": "Conversation not found"},
                status_code=404
            )
            
        msgs = await db.find_by_ids("Message", conv[0]['messages'])
        linkUploaded = False
        if conv[0].get('links'):
            linkUploaded = True if len(conv[0]['links']) > 0 else False
            
        if conv[0].get("fileName"):
            return {
                "messages": msgs if msgs else None,
                "file": {
                    "fileName": conv[0]["fileName"],
                    "fileMime": conv[0]["fileMime"]
                },
                "api_status": api_status,
                "linkUploaded": linkUploaded
            }
        return {
            "messages": msgs if msgs else None,
            "file": None,
            "api_status": api_status,
            "linkUploaded": linkUploaded
        }
            
    except Exception as e:
        print(f"Error in get_messages: {str(e)}")
        return JSONResponse(
            content={"error": f"Failed to get messages: {str(e)}"},
            status_code=500
        )

@router.post("/get-conv-details")
async def get_conv_details(req: GetConvDetails):
    convs = await db.find_by_ids("convos", req.ids)
    conv_data = [{"timestamp": conv["createTime"], "messageCount": len(conv["messages"])} for conv in convs]
    totalMessages, totalFiles = 0, 0

    for conv in convs:
        totalMessages += len(conv["messages"])
        if conv["fileName"]:
            totalFiles += 1
    return {"conv_data": conv_data, "totalMessages": totalMessages, "totalFiles": totalFiles}

@router.post("/remove-conv")
async def deleteConv(req: DeleteConversatoin):
    try:
        conv = await db.find('convos', {'_id': ObjectId(req.conv_id)})
        if not conv:
            return JSONResponse(content={"error": "Conversation not found"}, status_code=404)
        if conv[0]['fileName']:
            delete_index(req.conv_id)
        await db.remove("convos", req.conv_id)
        return JSONResponse(content={"success": "Succesfully deleted the conversation"}, status_code=200)
    except Exception as e:
        print(str(e))
        return JSONResponse(content={"error": "Something went wrong"}, status_code=400)

@router.post("/upload-link")
async def upload_link(req: UploadLink):
    isYoutube = req.link.startswith("https://youtu.be")
    if (isYoutube):
        return await upload_youtube_video(req.link, req.conv_id)
    else:
        return await upload_link_data(req.link, req.conv_id)

async def upload_youtube_video(video_url: str, conv_id: str):
    try:
        print(f"Received request to process YouTube video: {video_url}")
        
        # Get transcript
        transcript_result = get_youtube_transcript(video_url)
        
        if "error" in transcript_result:
            return JSONResponse(
                content={"error": transcript_result["error"]},
                status_code=400
            )
            
        if not transcript_result.get("success"):
            return JSONResponse(
                content={"error": "Failed to process video transcript"},
                status_code=400
            )
            
        update_index(file=None, fileType=None, text=transcript_result["transcript"], conv_id=conv_id)
        
        # Update conversation with video info
        await db.update("convos", 
            {"_id": ObjectId(conv_id)}, 
            {"$push": {
                "links": {
                    "linkName": f"YouTube Video - {transcript_result['video_id']}",
                    "linkUrl": video_url,
                    "linkType": "youtube_transcript"
                }
            }}
        )
        
        return {
            "message": "success",
            "video_id": transcript_result["video_id"],
            "transcript_length": len(transcript_result["transcript"])
        }
        
    except Exception as e:
        print(f"Error in upload_youtube_video: {str(e)}")
        return JSONResponse(
            content={"error": f"Error processing YouTube video: {str(e)}"},
            status_code=400
        )

async def upload_link_data(url: str, conv_id: str):
    try:
        link_data = get_link_data(url, conv_id)
        if link_data.get("error"):
            return JSONResponse(
                content={"error": link_data["error"]},
                status_code=400
            )
        await db.update("convos", {"_id": ObjectId(conv_id)}, {"$push": {"links": {
            "linkName": "",
            "linkUrl": url,
            "linkType": "web_link"
        }}})
        return {
            "message": "success"
        }
    except Exception as e:
        print(f"Error in upload_link_data: {str(e)}")
        return JSONResponse(
            content={"error": f"Error processing link data: {str(e)}"},
            status_code=400
        )