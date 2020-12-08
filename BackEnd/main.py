import datetime
import errno
import os
import shutil
import uuid
from typing import List, Optional
from uuid import UUID
import multipart
import uvicorn
from PIL import Image
import PIL
from starlette.responses import JSONResponse

from security import encryption

from sql_backend import crud, models, schemas
from sql_backend.database import SessionLocal, engine

from fastapi import Depends, FastAPI, HTTPException, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "https://localhost",
    "localhost:3030",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "https://www.twitch.tv/"

]

sessions = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/login", response_model=schemas.User)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user is None:
        return JSONResponse(content={"success": False, "message": "User does not exist."})
    if encryption.check_encrypted_password(user.password, db_user.hashed_password):
        db_user.authToken = str(uuid.uuid4())
        db_user.refreshToken = str(uuid.uuid4())
        db.commit()
        sessions[db_user.authToken] = {'valid': True, 'issued': datetime.datetime.now()}
        return JSONResponse(content={"success": True, "authToken": db_user.authToken,
                                     "refreshToken": db_user.refreshToken,
                                     "id":db_user.id, "username": db_user.username})
    return JSONResponse(content={"success": False, "message": "Invalid password."})


@app.post("/logout")
def logout_user(user: schemas.UserAuth, db: Session = Depends(get_db)):
    sessions.pop(user.authToken, None)
    return JSONResponse(status_code=200)


@app.post("/auth", response_model=schemas.User)
def auth_user(user: schemas.UserAuth, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_token(db, user.authToken)
    if sessions.get(user.authToken, None) is None:
        if user.refreshToken == db_user.refreshToken:
            db_user.authToken = str(uuid.uuid4())
            db.commit()
            sessions[db_user.authToken] = {'valid': True, 'issued': datetime.datetime.now()}
            return db_user
    if sessions[user.authToken]['valid'] == True:
        if sessions[user.authToken]['issued'] + datetime.timedelta(hours= 5) < datetime.datetime.now():
            if user.refreshToken == db_user.refreshToken:
                sessions.pop(user.authToken, None)
                db_user.authToken = str(uuid.uuid4())
                db.commit()
                sessions[db_user.authToken] = {'valid': True, 'issued': datetime.datetime.now()}
                return db_user
            sessions[user.authToken]['valid'] = False
            return JSONResponse(content={"success": False, "message":"Refresh token has expired, login again."})
        return db_user
    return JSONResponse(content={"success": False, "message": "Invalid token, please login again."})


@app.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        return JSONResponse(content={"success": False, "message": "Email already registered"})
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        return JSONResponse(content={"success": False, "message": "Username already exists"})
    return crud.create_user(db=db, user=user)


# @app.get("/users/", response_model=List[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/emotes/", response_model=schemas.Emote)
def create_emote(emoteName: str = Form(...), uploader: str = Form(...), description: Optional[str] = Form(...)
                 , db: Session = Depends(get_db), file: UploadFile = File(...)):
    db_emote = crud.get_emote_by_name(db, name=emoteName)

    if db_emote:
        raise HTTPException(status_code=400, detail="Emote already created")
    fileName = emoteName +"."+ file.content_type.split("/")[1]
    print(file.content_type)
    fileURL = "/uploads/" + fileName
    fileLocation = os.path.join(os.getcwd() + "\\uploads\\", fileName)
    print(fileURL)
    with safe_open_w(fileLocation) as f:
        shutil.copyfileobj(file.file, f)
    new_emote = crud.create_user_emote(db=db, uploader=uploader, emoteName=emoteName, description=description, url=fileURL)
    return new_emote


@app.get("/users/{user_id}/emotes/", response_model=List[schemas.Emote])
def get_all_emotes(
        user_id: str, db: Session = Depends(get_db)
):
    return crud.get_all_user_emotes(db=db, user_id=user_id)


@app.post("/users/{user_id}/emotes/", response_model=schemas.EmoteList)
def user_emote_link(user: schemas.EmoteListCreate, db: Session = Depends(get_db)):
    return crud.create_emote_link(db=db, item=user)


@app.post("/users/{user_id}/emotes/rm/", response_model=List[schemas.Emote])
def user_remove_emote_link(user: schemas.EmoteListCreate, db: Session = Depends(get_db)):
    return crud.remove_emote_link(user=user.accountLinked, emote=user.emote, db=db)


@app.get("/emotes/", response_model=List[schemas.Emote])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), search: str = ""):
    emotes = crud.get_emotes(db, skip=skip, limit=limit, search=search)
    return emotes


@app.get("/emote/{emote}", response_model=schemas.Emote)
def read_items(emote: str, db: Session = Depends(get_db)):
    print(emote)
    emote = crud.get_emote_by_name(db, name=emote)
    return emote


@app.get("/uploads/{emote}")
def get_emote_image(emote: str):
    return FileResponse(os.getcwd() + "\\uploads\\" + emote)


@app.post("/account/changeEmail")
def user_change_email(usrpass: str = Form(...), email: str = Form(...), user: str = Form(...),
                      db: Session = Depends(get_db)):
    print("Changing email...")
    db_user = crud.get_user(db, user_id=user)
    if encryption.check_encrypted_password(usrpass, db_user.hashed_password):
        if crud.get_user_by_email(db, email=email) is None:
            db_user.email = email
            db.commit()
            return JSONResponse(status_code=200, content={"success": True, "message": "Email successfully changed"})
        return JSONResponse(status_code=200, content={"success": False, "message": "Email already registered"})
    return JSONResponse(status_code=200, content={"success": False, "message": "Invalid password"})


@app.post("/account/changePassword")
def user_change_password(oldpass: str = Form(...), newpass: str = Form(...), user: str = Form(...),
                         db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user)
    if encryption.check_encrypted_password(oldpass, db_user.hashed_password):
        if oldpass != newpass:
            db_user.hashed_password = encryption.encrypt_password(newpass)
            db.commit()
            return JSONResponse(status_code=200, content={"success": True, "message": "Password successfully changed"})
        return JSONResponse(status_code=200, content={"success": False, "message": "Password can't be the same!"})
    return JSONResponse(status_code=200, content={"success": False, "message": "Invalid password"})


# Used for making directories that do not exist.
def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def safe_open_w(path):
    ''' Open "path" for writing, creating any parent directories as needed.
    '''
    mkdir_p(os.path.dirname(path))
    return open(path, 'wb')


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")