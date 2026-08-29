from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine
from app.database import Base
from app.routers import auth, contact, experiences, profile, projects, skills


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.AUTO_CREATE_TABLES:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="Portafolio API",
    description="API REST para el portafolio de Kevin Pérez",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(profile.router)
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(experiences.router)
app.include_router(contact.router)
app.include_router(auth.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "portafolio-api"}
