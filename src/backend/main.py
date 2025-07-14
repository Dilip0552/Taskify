from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import JSONResponse
import pymongo
from passlib.context import CryptContext
from typing import Optional
from datetime import date
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


app=FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)
app.add_middleware(
    SessionMiddleware,
    secret_key="ibuildknockie",
    session_cookie="session_id",
    same_site="none",
    https_only=False
)

class SignUpData(BaseModel):
    fullName:str
    email:str
    password:str

class LoginData(BaseModel):
    email:str
    password:str

class Task(BaseModel):
    title:str
    description:Optional[str]
    status:Optional[bool]
    due_date:Optional[date]
    priority:Optional[str]
    user_id:str

class StatusUpdate(BaseModel):
    status: bool

MONGO_URL="mongodb://localhost:27017/userDatabase"
try:
    global client
    client=pymongo.MongoClient(MONGO_URL)
except:
    raise HTTPException(detail="Could not connnect to database server")


def hash_password(password: str):
    return pwd_context.hash(password)

@app.post("/api/register")
def registerUser(user:SignUpData):
    try:
        db=client["Credentials"]
        collection=db["Passwords"]
        existingUser=collection.find_one({"email": user.email})
        if not existingUser:
            user.password = hash_password(user.password)
            collection.insert_one(user.dict())
            return {"message":"Account Created Successfully"}
        else:
            return {"message":"An account with this email already exist. Please login"}
    except Exception as e:
        return {"message":f"An error ocurred: {e}"}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/api/login")
def login(credentials:LoginData):
    try:
        db=client["Credentials"]
        collection=db["Passwords"]
        user=collection.find_one({"email": credentials.email})
        if not user:
            return {"message": "User not found"}
        if verify_password(credentials.password,user["password"]):
            return {"message": "Login successful","Status":True,"user_id":str(user["_id"])}
        else:
            return  {"message": "Wrong password","Status":False,"user_id":None}

    except Exception as e:
        return {"message":f"Could not try: {e}"}

@app.post("/api/add-task")
def addTask(task:Task):
    db=client["Tasks"]
    task_collection=db["Tasks"]
    task_dict = jsonable_encoder(task)
    result=task_collection.insert_one(task_dict)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Task not added")
    return {"message": "Task added successfully"}


@app.get("/api/tasks/{user_id}")
def get_tasks(user_id: str):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    all_tasks = task_collection.find({"user_id": user_id})

    tasks = []
    for task in all_tasks:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks  

@app.get("/api/task/{user_id}/{taskID}")
def get_task(user_id: str, taskID: str):
    db = client["Tasks"]
    task_collection = db["Tasks"]

    try:
        task = task_collection.find_one({
            "_id": ObjectId(taskID),
            "user_id": user_id  
        })
    except Exception as e:
        return {"message": f"Error occurred: {str(e)}"}

    if not task:
        return {"message": f"No task found with user_id {user_id} and taskID {taskID}"}

    task["_id"] = str(task["_id"])  
    return task
    
@app.put("/api/update-task/{taskID}")
def updateTask(task:Task,taskID:str):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    try:
        task_dict = jsonable_encoder(task)
        result = task_collection.update_one({"_id": ObjectId(taskID)},
        {"$set": task_dict})
    except Exception as e:
        return {"message": f"Error occurred: {str(e)}"}


@app.delete("/api/task/{taskID}")
def delete_task(taskID:str):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    result = task_collection.delete_one({"_id":ObjectId(taskID)})
    if result.deleted_count==1:
        return {"message":"Task Deleted Succesfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")




@app.put("/api/task/{task_id}/status")
def update_task_status(task_id: str, update: StatusUpdate):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    
    result = task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": update.status}}
    )

    if result.modified_count == 1:
        return {"message": "Task status updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found or already updated")