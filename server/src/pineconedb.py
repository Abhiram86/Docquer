import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

api_key = os.getenv("PINECONE_KEY")

pc = Pinecone(api_key=api_key)

spec = ServerlessSpec(
    cloud='aws',
    region='us-east-1'
)