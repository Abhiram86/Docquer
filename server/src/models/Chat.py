from pydantic import BaseModel
from typing import List

class NormalChat(BaseModel):
    username: str
    query: str
    # api_key: str
    conv_id: str
    messageIds: List[str]

class FileChat(BaseModel):
    username: str
    conv_id: str
    # api_key: str
    # fileMime: str
    query: str
    messageIds: List[str]

class FileReplace(BaseModel):
    conv_id: str
    yt_link: str

class NewChat(BaseModel):
    title: str
    subTitle: str
    username: str
    firstMessage: str
    fileName: str
    fileMime: str
    messages: List[str]
    # api_key: str

class GetConvos(BaseModel):
    ids: List[str]

class GetMessages(BaseModel):
    id: str
    userId: str

class GetConvDetails(BaseModel):
    ids: List[str]

class DeleteConversatoin(BaseModel):
    conv_id: str