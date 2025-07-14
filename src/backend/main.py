from fastapi import FastAPI, Request, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import pymongo
from passlib.context import CryptContext
from typing import Optional
from datetime import date, datetime, timedelta
from fastapi.encoders import jsonable_encoder
from jose import JWTError, jwt
from bson import ObjectId

# JWT Configuration
SECRET_KEY = "ibuildknockie"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

app = FastAPI()

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
    fullName: str
    email: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

class Task(BaseModel):
    title: str
    description: Optional[str]
    status: Optional[bool]
    due_date: Optional[date]
    priority: Optional[str]
    user_id: str

class StatusUpdate(BaseModel):
    status: bool

MONGO_URL = "mongodb://localhost:27017/userDatabase"
try:
    client = pymongo.MongoClient(MONGO_URL)
except:
    raise HTTPException(detail="Could not connect to database server")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

@app.post("/api/register")
def register_user(user: SignUpData):
    db = client["Credentials"]
    collection = db["Passwords"]
    existing_user = collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "An account with this email already exists. Please login"}

    user.password = hash_password(user.password)
    collection.insert_one(user.dict())
    return {"message": "Account Created Successfully"}

@app.post("/api/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = client["Credentials"]
    collection = db["Passwords"]
    user = collection.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(user["_id"])}

@app.post("/api/logout")
def logout():
    # For simple stateless JWT, logout is handled client-side
    return {"message": "Logged out successfully"}

@app.post("/api/add-task")
def add_task(task: Task, user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    task_dict = jsonable_encoder(task)
    task_dict["user_id"] = user_id
    result = task_collection.insert_one(task_dict)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Task not added")
    return {"message": "Task added successfully"}

@app.get("/api/tasks/{user_id}")
def get_tasks(user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    all_tasks = task_collection.find({"user_id": user_id})
    tasks = []
    for task in all_tasks:
        task["_id"] = str(task["_id"])
        tasks.append(task)
    return tasks

@app.get("/api/task/{user_id}/{taskID}")
def get_task(taskID: str, user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    task = task_collection.find_one({"_id": ObjectId(taskID), "user_id": user_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["_id"] = str(task["_id"])
    return task

@app.put("/api/update-task/{user_id}/{taskID}")
def update_task(task: Task, taskID: str, user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    task_dict = jsonable_encoder(task)
    task_dict["user_id"] = user_id
    result = task_collection.update_one({"_id": ObjectId(taskID), "user_id": user_id}, {"$set": task_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Task not found or not updated")
    return {"message": "Task updated successfully"}

@app.delete("/api/task/{taskID}")
def delete_task(taskID: str, user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    result = task_collection.delete_one({"_id": ObjectId(taskID), "user_id": user_id})
    if result.deleted_count == 1:
        return {"message": "Task Deleted Successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@app.put("/api/task/{task_id}/status")
def update_task_status(task_id: str, update: StatusUpdate, user_id: str = Depends(get_current_user)):
    db = client["Tasks"]
    task_collection = db["Tasks"]
    result = task_collection.update_one(
        {"_id": ObjectId(task_id), "user_id": user_id},
        {"$set": {"status": update.status}}
    )
    if result.modified_count == 1:
        return {"message": "Task status updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found or already updated")
