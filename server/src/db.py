import os
from pymongo import MongoClient
from dotenv import load_dotenv
from fastapi.concurrency import run_in_threadpool
from typing import List
from bson import ObjectId

load_dotenv()

MONGO_URL = os.getenv("DATABASE_URL")

class MongoDB:
    def __init__(self, url=MONGO_URL):
        self.client = MongoClient(url)
        self.db = self.client["Docquer"]

    async def get_collection(self, name):
        return await run_in_threadpool(lambda: self.db[name])

    async def insert(self, name, data):
        collection = await self.get_collection(name)
        result = await run_in_threadpool(lambda: collection.insert_one(data))
        return result.inserted_id

    async def find(self, name, query={}):
        collection = await self.get_collection(name)
        cursor = await run_in_threadpool(lambda: list(collection.find(query)))
        return cursor
    
    async def find_by_ids(self, name, ids: List[str]):
        collection = await self.get_collection(name)
        object_ids = [ObjectId(id) for id in ids]
        query = {"_id": {"$in": object_ids}}
        documents = await run_in_threadpool(lambda: list(collection.find(query)))
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        return documents
    
    async def update(self, name, query, update_data, many=False):
        collection = await self.get_collection(name)
        if many:
            result = await run_in_threadpool(lambda: collection.update_many(query, update_data))
        else:
            result = await run_in_threadpool(lambda: collection.update_one(query, update_data))
        return result.modified_count
    
    async def remove(self, name, id: str):
        collection = await self.get_collection(name)
        object_id = ObjectId(id)
        result = await run_in_threadpool(lambda: collection.delete_one({'_id': object_id}))
        return result.deleted_count