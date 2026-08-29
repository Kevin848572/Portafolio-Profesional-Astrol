from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.experience import ExperienceCreate, ExperienceResponse, ExperienceUpdate

router = APIRouter(prefix="/api/experiences", tags=["experiences"])


@router.get("", response_model=list[ExperienceResponse])
async def list_experiences(db: AsyncSession = Depends(get_db)):
    return await crud.experiences.get_all_experiences(db)


@router.get("/{experience_id}", response_model=ExperienceResponse)
async def read_experience(experience_id: int, db: AsyncSession = Depends(get_db)):
    experience = await crud.experiences.get_experience_by_id(db, experience_id)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada"
        )
    return experience


@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    data: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await crud.experiences.create_experience(db, data)


@router.put("/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    experience_id: int,
    data: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    experience = await crud.experiences.update_experience(db, experience_id, data)
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada"
        )
    return experience


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    experience_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deleted = await crud.experiences.delete_experience(db, experience_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Experiencia no encontrada"
        )
