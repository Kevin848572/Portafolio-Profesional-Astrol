from pydantic import BaseModel


class ProjectBase(BaseModel):
    slug: str
    title: str
    description: str
    long_description: str | None = None
    category: str
    tags: list[str] = []
    image: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    description: str | None = None
    long_description: str | None = None
    category: str | None = None
    tags: list[str] | None = None
    image: str | None = None
    demo_url: str | None = None
    github_url: str | None = None
    featured: bool | None = None


class ProjectResponse(ProjectBase):
    id: int

    model_config = {"from_attributes": True}
