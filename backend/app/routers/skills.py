from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.skill import (
    SkillCategoryCreate,
    SkillCategoryResponse,
    SkillCreate,
    SkillResponse,
    SkillUpdate,
)

router = APIRouter(prefix="/api/skills", tags=["skills"])


@router.get("", response_model=list[SkillCategoryResponse])
async def list_skills(db: AsyncSession = Depends(get_db)):
    return await crud.skills.get_all_categories(db)


@router.get("/flat", response_model=list[SkillResponse])
async def list_skills_flat(db: AsyncSession = Depends(get_db)):
    return await crud.skills.get_all_skills_flat(db)


@router.get("/{skill_id}", response_model=SkillResponse)
async def read_skill(skill_id: int, db: AsyncSession = Depends(get_db)):
    skill = await crud.skills.get_skill_by_id(db, skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill no encontrada")
    return skill


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category = await crud.skills.get_category_by_id(db, data.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )
    return await crud.skills.create_skill(db, data)


@router.put("/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    skill = await crud.skills.update_skill(db, skill_id, data)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill no encontrada")
    return skill


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deleted = await crud.skills.delete_skill(db, skill_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill no encontrada")


# --- Categories ---


@router.post(
    "/categories",
    response_model=SkillCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    data: SkillCategoryCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await crud.skills.create_category(db, data)
