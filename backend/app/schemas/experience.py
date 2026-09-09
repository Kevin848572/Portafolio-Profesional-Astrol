# pyrefly: ignore [missing-import]
from pydantic import BaseModel


class ExperienceAchievementBase(BaseModel):
    text: str


class ExperienceAchievementCreate(ExperienceAchievementBase):
    pass


class ExperienceAchievementResponse(ExperienceAchievementBase):
    id: int

    model_config = {"from_attributes": True}


class ExperienceBase(BaseModel):
    year: str
    period: str
    role: str
    company: str
    description: str
    tags: list[str] = []


class ExperienceCreate(ExperienceBase):
    achievements: list[ExperienceAchievementCreate] = []


class ExperienceUpdate(BaseModel):
    year: str | None = None
    period: str | None = None
    role: str | None = None
    company: str | None = None
    description: str | None = None
    tags: list[str] | None = None
    achievements: list[ExperienceAchievementCreate] | None = None


class ExperienceResponse(ExperienceBase):
    id: int
    achievements: list[ExperienceAchievementResponse] = []

    model_config = {"from_attributes": True}
