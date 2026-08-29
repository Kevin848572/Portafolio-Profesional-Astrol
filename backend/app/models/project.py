from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    long_description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)
    tags = Column(ARRAY(Text), nullable=False, default=list)
    image = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    featured = Column(Boolean, default=False)
