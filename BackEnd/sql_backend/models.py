import uuid

from sqlalchemy import Column, ForeignKey,String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(length=64), default=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    email = Column(String(length=64), unique=True, index=True)
    username = Column(String(length=32), unique=True, index=True)
    hashed_password = Column(String(length=255))
    authToken = Column(String(length=255))
    refreshToken = Column(String(length=255))

    uploadedEmotes = relationship("Emote", back_populates="owner")
    usingEmotes = relationship("EmoteList", back_populates="owner")
    accountLinks = relationship("AccountLinks", back_populates="owner")


class Emote(Base):
    __tablename__ = "emote"

    emoteName = Column(String(length=32), primary_key=True, index=True)
    emoteURL = Column(String(length=64), index=True)
    description = Column(String(length=64), index=True)
    uploader = Column(String(length=64), ForeignKey("users.id"))

    owner = relationship("User", back_populates="uploadedEmotes")


class EmoteList(Base):
    __tablename__ = "emotelist"

    emoteLink = Column(String(length=64), default=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    emote = Column(String(length=32), ForeignKey("emote.emoteName"))
    accountLinked = Column(String(length=64), ForeignKey("users.id"))

    owner = relationship("User", back_populates="usingEmotes")

class AccountLinks(Base):
    __tablename__ = "accountlinks"

    accountLink = Column(String(length=64), default=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    platform = Column(String(length=32), index=True)
    platformName = Column(String(length=128), index=True)
    accountLinked = Column(String(length=64), ForeignKey("users.id"))

    owner = relationship("User", back_populates="accountLinks")

