from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

class Memo(BaseModel):
    id:str
    content:str

memos=[]

@app.post("/memos")
def create_memo(memo: Memo):
    memos.append(memo)
    return {"message": "메모 추가 성공"}

@app.get("/memos")
def read_memo():
    return memos

app.mount("/", StaticFiles(directory="static", html=True), name="static")
