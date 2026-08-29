from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from app.database import Base


class Profile(Base):
    __tablename__ = "profile"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False)
    title = Column(Text, nullable=False)
    subtitle = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=False)
    email = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    cv_url = Column(String(500), nullable=True)
    stats = Column(JSONB, nullable=False, default=list)
    socials = Column(JSONB, nullable=False, default=dict)
