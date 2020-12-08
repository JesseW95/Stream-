from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey
from security import encryption
from . import models, schemas


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_token(db: Session, authtoken: str):
    return db.query(models.User).filter(models.User.authToken == authtoken).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    password = encryption.encrypt_password(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=password)
    print(db_user)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_emotes(db: Session, skip: int = 0, limit: int = 100, search: str = ""):
    emotes = db.query(models.Emote).offset(skip).limit(limit).all()
    if search.strip():
        emotes = db.query(models.Emote).filter(models.Emote.emoteName.contains(search)).offset(skip).limit(limit).all()
    return emotes


def get_emote_by_name(db: Session, name: str):
    return db.query(models.Emote).filter(models.Emote.emoteName == name).first()


def create_user_emote(db: Session, uploader:str, emoteName:str, url: str, description: Optional[str]):
    db_emote = models.Emote(uploader=uploader, emoteName=emoteName, description=description, emoteURL=url)
    db.add(db_emote)
    db.commit()
    db.refresh(db_emote)
    return db_emote


def get_user_emotes(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.EmoteList).filter(models.EmoteList.accountLinked == user_id).offset(skip).limit(limit).all()


def get_all_user_emotes(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    usingEmotes = db.query(models.Emote).join(models.EmoteList).filter(models.EmoteList.accountLinked == user_id)
    ret = usingEmotes.offset(skip).limit(limit).all()
    return ret


def create_emote_link(db: Session, item: schemas.EmoteListCreate):
    db_emoteLink = models.EmoteList(accountLinked=item.accountLinked, emote=item.emote)
    db.add(db_emoteLink)
    db.commit()
    db.refresh(db_emoteLink)
    return db_emoteLink


def remove_emote_link(db: Session, user: str, emote: str):
    db.query(models.EmoteList).filter(models.EmoteList.accountLinked == user).filter(models.EmoteList.emote == emote).delete()
    db.commit()
    return get_all_user_emotes(db, user, 0, 100)


def create_account_link(db: Session, item: schemas.AccountLinksCreate):
    db_accountLink = models.EmoteList(**item.dict())
    db.add(db_accountLink)
    db.commit()
    db.refresh(db_accountLink)
    return db_accountLink


def get_linked_accounts(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(models.EmoteList).filter(models.AccountLinks.accountLinked == user_id).offset(skip).limit(
        limit).all()
