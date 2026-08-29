from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(String(10), nullable=False)
    period = Column(String(100), nullable=False)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tags = Column(ARRAY(Text), nullable=False, default=list)

    achievements = relationship(
        "ExperienceAchievement", back_populates="experience", cascade="all, delete-orphan"
    )


class ExperienceAchievement(Base):
    __tablename__ = "experience_achievements"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    experience_id = Column(Integer, ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False)

    experience = relationship("Experience", back_populates="achievements")
