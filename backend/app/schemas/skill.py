from pydantic import BaseModel


class SkillBase(BaseModel):
    name: str
    level: str
    description: str | None = None
    category_id: int


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = None
    level: str | None = None
    description: str | None = None
    category_id: int | None = None


class SkillResponse(SkillBase):
    id: int

    model_config = {"from_attributes": True}


class SkillCategoryBase(BaseModel):
    name: str


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryResponse(SkillCategoryBase):
    id: int
    skills: list[SkillResponse] = []

    model_config = {"from_attributes": True}
