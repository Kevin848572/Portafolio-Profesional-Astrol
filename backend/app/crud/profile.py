from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate


async def get_profile(db: AsyncSession) -> Profile | None:
    result = await db.execute(select(Profile).limit(1))
    return result.scalar_one_or_none()


async def create_profile(db: AsyncSession, **kwargs) -> Profile:
    profile = Profile(**kwargs)
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile


async def update_profile(db: AsyncSession, profile_id: int, data: ProfileUpdate) -> Profile | None:
    result = await db.execute(select(Profile).where(Profile.id == profile_id))
    profile = result.scalar_one_or_none()
    if not profile:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return profile
