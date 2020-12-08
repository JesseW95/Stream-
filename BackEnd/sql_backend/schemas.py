from typing import List, Optional

from pydantic import BaseModel


class EmoteBase(BaseModel):
    uploader: str
    emoteName: str
    description: Optional[str] = None


class EmoteCreate(EmoteBase):
    pass


class Emote(EmoteBase):
    emoteURL: str

    class Config:
        orm_mode = True


class EmoteListBase(BaseModel):
    pass


class EmoteListCreate(EmoteListBase):
    emote: str
    accountLinked: str


class EmoteList(EmoteListBase):
    emote: str
    emoteLink: str

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    pass


class UserCreate(UserBase):
    email: str
    username: str
    password: str


class UserLogin(UserBase):
    username: str
    password: str


class UserAuth(UserBase):
    authToken: Optional[str] = None
    refreshToken: Optional[str] = None


class User(UserBase):
    id: str
    username: str
    email: str
    uploadedEmotes: List[Emote] = []
    usingEmotes: List[EmoteList] = []

    class Config:
        orm_mode = True


class AccountLinksBase(BaseModel):
    accountLinked: str


class AccountLinksCreate(AccountLinksBase):
    platform: str
    platformName: str


class AccountLinksList(AccountLinksBase):
    accountLink: str

    class Config:
        orm_mode = True
