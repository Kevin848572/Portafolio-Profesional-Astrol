from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.skill import Skill, SkillCategory
from app.schemas.skill import SkillCategoryCreate, SkillCreate, SkillUpdate


async def get_all_categories(db: AsyncSession) -> list[SkillCategory]:
    result = await db.execute(
        select(SkillCategory).options(selectinload(SkillCategory.skills)).order_by(SkillCategory.id)
    )
    return list(result.scalars().unique().all())


async def get_category_by_id(db: AsyncSession, category_id: int) -> SkillCategory | None:
    result = await db.execute(
        select(SkillCategory)
        .options(selectinload(SkillCategory.skills))
        .where(SkillCategory.id == category_id)
    )
    return result.scalar_one_or_none()


async def create_category(db: AsyncSession, data: SkillCategoryCreate) -> SkillCategory:
    category = SkillCategory(**data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def get_skill_by_id(db: AsyncSession, skill_id: int) -> Skill | None:
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    return result.scalar_one_or_none()


async def get_all_skills_flat(db: AsyncSession) -> list[Skill]:
    result = await db.execute(select(Skill).order_by(Skill.id))
    return list(result.scalars().all())


async def create_skill(db: AsyncSession, data: SkillCreate) -> Skill:
    skill = Skill(**data.model_dump())
    db.add(skill)
    await db.commit()
    await db.refresh(skill)
    return skill


async def update_skill(db: AsyncSession, skill_id: int, data: SkillUpdate) -> Skill | None:
    skill = await get_skill_by_id(db, skill_id)
    if not skill:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(skill, field, value)

    await db.commit()
    await db.refresh(skill)
    return skill


async def delete_skill(db: AsyncSession, skill_id: int) -> bool:
    skill = await get_skill_by_id(db, skill_id)
    if not skill:
        return False

    await db.delete(skill)
    await db.commit()
    return True
