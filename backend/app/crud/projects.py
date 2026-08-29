from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


async def get_all_projects(db: AsyncSession, category: str | None = None) -> list[Project]:
    stmt = select(Project)
    if category and category != "Todos":
        stmt = stmt.where(Project.category.ilike(category))
    result = await db.execute(stmt.order_by(Project.id))
    return list(result.scalars().all())


async def get_featured_projects(db: AsyncSession) -> list[Project]:
    result = await db.execute(
        select(Project).where(Project.featured == True).order_by(Project.id)
    )
    return list(result.scalars().all())


async def get_project_by_id(db: AsyncSession, project_id: int) -> Project | None:
    result = await db.execute(select(Project).where(Project.id == project_id))
    return result.scalar_one_or_none()


async def get_project_by_slug(db: AsyncSession, slug: str) -> Project | None:
    result = await db.execute(select(Project).where(Project.slug == slug))
    return result.scalar_one_or_none()


async def create_project(db: AsyncSession, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


async def update_project(db: AsyncSession, project_id: int, data: ProjectUpdate) -> Project | None:
    project = await get_project_by_id(db, project_id)
    if not project:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: int) -> bool:
    project = await get_project_by_id(db, project_id)
    if not project:
        return False

    await db.delete(project)
    await db.commit()
    return True
