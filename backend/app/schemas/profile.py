from typing import Any

from pydantic import BaseModel


class StatItem(BaseModel):
    label: str
    value: str


class SocialLinks(BaseModel):
    github: str | None = None
    linkedin: str | None = None
    instagram: str | None = None


class ProfileBase(BaseModel):
    name: str
    role: str
    status: str
    title: str
    subtitle: str
    image_url: str
    email: str
    location: str
    cv_url: str | None = None
    stats: list[dict[str, Any]] = []
    socials: dict[str, Any] = {}


class ProfileUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    status: str | None = None
    title: str | None = None
    subtitle: str | None = None
    image_url: str | None = None
    email: str | None = None
    location: str | None = None
    cv_url: str | None = None
    stats: list[dict[str, Any]] | None = None
    socials: dict[str, Any] | None = None


class ProfileResponse(ProfileBase):
    id: int

    model_config = {"from_attributes": True}
