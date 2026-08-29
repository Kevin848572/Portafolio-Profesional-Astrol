from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.experience import Experience, ExperienceAchievement
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


async def get_all_experiences(db: AsyncSession) -> list[Experience]:
    result = await db.execute(
        select(Experience)
        .options(selectinload(Experience.achievements))
        .order_by(Experience.id)
    )
    return list(result.scalars().unique().all())


async def get_experience_by_id(db: AsyncSession, experience_id: int) -> Experience | None:
    result = await db.execute(
        select(Experience)
        .options(selectinload(Experience.achievements))
        .where(Experience.id == experience_id)
    )
    return result.scalar_one_or_none()


async def create_experience(db: AsyncSession, data: ExperienceCreate) -> Experience:
    achievements_data = data.achievements
    experience_dict = data.model_dump(exclude={"achievements"})
    experience = Experience(**experience_dict)

    for ach in achievements_data:
        experience.achievements.append(ExperienceAchievement(text=ach.text))

    db.add(experience)
    await db.commit()
    await db.refresh(experience)
    return experience


async def update_experience(
    db: AsyncSession, experience_id: int, data: ExperienceUpdate
) -> Experience | None:
    experience = await get_experience_by_id(db, experience_id)
    if not experience:
        return None

    update_data = data.model_dump(exclude_unset=True, exclude={"achievements"})
    for field, value in update_data.items():
        setattr(experience, field, value)

    if data.achievements is not None:
        await db.execute(
            ExperienceAchievement.__table__.delete().where(
                ExperienceAchievement.experience_id == experience_id
            )
        )
        for ach in data.achievements:
            experience.achievements.append(ExperienceAchievement(text=ach.text))

    await db.commit()
    await db.refresh(experience)
    return experience


async def delete_experience(db: AsyncSession, experience_id: int) -> bool:
    experience = await get_experience_by_id(db, experience_id)
    if not experience:
        return False

    await db.delete(experience)
    await db.commit()
    return True
