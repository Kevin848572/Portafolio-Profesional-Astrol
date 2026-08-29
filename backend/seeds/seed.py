"""
Script de seed: migra los datos hardcodeados de src/models/ a PostgreSQL.

Uso:
    cd backend
    python -m seeds.seed
"""

import asyncio
import selectors

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import hash_password
from app.database import Base, async_session, engine
from app.models.experience import Experience, ExperienceAchievement
from app.models.profile import Profile
from app.models.project import Project
from app.models.skill import Skill, SkillCategory
from app.models.user import User


# ─── Datos extraídos de src/models/ProfileModel.js ───
PROFILE_DATA = {
    "name": "Kevin Pérez",
    "role": "Desarrollador Frontend & UI Specialist",
    "status": "Disponible para proyectos",
    "title": "Creando Experiencias Digitales de Alto Nivel.",
    "subtitle": "Desarrollador Web especializado en la creación de interfaces estéticas, reactivas y de alto rendimiento utilizando Astro, React y Tailwind CSS.",
    "image_url": "/logo.png",
    "email": "kp389301@gmail.com",
    "location": "Honduras",
    "cv_url": "#",
    "stats": [
        {"label": "Años de Experiencia", "value": "+2"},
        {"label": "Proyectos en Producción", "value": "12+"},
        {"label": "Tecnologías Dominadas", "value": "14+"},
    ],
    "socials": {
        "github": "https://github.com/Kevin848572",
        "linkedin": "https://www.linkedin.com/in/kevin-josé-pérez-martínez-4a7bbb23b",
        "instagram": "https://www.instagram.com/kevin_perez52",
    },
}


# ─── Datos extraídos de src/models/ProjectModel.js ───
PROJECTS_DATA = [
    {
        "slug": "prestaciones-laborales",
        "title": "Prestaciones Laborales Hondureñas",
        "description": "Aplicación para Recursos Humanos",
        "long_description": "Sistema web integral diseñado para automatizar el cálculo de prestaciones laborales según la legislación hondureña.",
        "category": "Sistemas",
        "tags": ["JavaScript", "HTML5", "CSS3", "Cálculos Legales"],
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        "demo_url": "https://github.com/Kevin848572/prestaciones-laborales",
        "github_url": "https://github.com/Kevin848572/prestaciones-laborales",
        "featured": True,
    },
    {
        "slug": "sistema-clinica",
        "title": "Sistema de Gestión Clínica",
        "description": "Sistema web para gestión de pacientes y citas médicas",
        "long_description": "Plataforma completa para la administración de clínicas con gestión de pacientes, citas y historial médico.",
        "category": "Sistemas",
        "tags": ["JavaScript", "HTML5", "CSS3", "Node.js"],
        "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        "demo_url": "https://github.com/Kevin848572/sistema-clinica",
        "github_url": "https://github.com/Kevin848572/sistema-clinica",
        "featured": True,
    },
    {
        "slug": "portafolio-3d",
        "title": "Portafolio 3D Interactivo",
        "description": "Portafolio personal con animaciones 3D y efectos visuales",
        "long_description": "Portafolio personal con animaciones 3D, efectos de parallax y transiciones cinematográficas.",
        "category": "Frontend",
        "tags": ["Astro", "React", "GSAP", "Tailwind CSS", "Three.js"],
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        "demo_url": "https://github.com/Kevin848572/portafolio-3d",
        "github_url": "https://github.com/Kevin848572/portafolio-3d",
        "featured": True,
    },
    {
        "slug": "dashboard-analytics",
        "title": "Dashboard de Analíticas",
        "description": "Panel de control con visualización de datos en tiempo real",
        "long_description": "Dashboard interactivo con gráficas, métricas y visualización de datos en tiempo real.",
        "category": "Frontend",
        "tags": ["React", "Chart.js", "Tailwind CSS", "API REST"],
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        "demo_url": "https://github.com/Kevin848572/dashboard-analytics",
        "github_url": "https://github.com/Kevin848572/dashboard-analytics",
        "featured": True,
    },
    {
        "slug": "e-commerce-ui",
        "title": "E-Commerce UI Kit",
        "description": "Kit de interfaz de usuario para tiendas online",
        "long_description": "Kit de componentes UI moderno y responsive para la construcción de tiendas online.",
        "category": "Frontend",
        "tags": ["React", "Tailwind CSS", "TypeScript"],
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
        "demo_url": "https://github.com/Kevin848572/e-commerce-ui",
        "github_url": "https://github.com/Kevin848572/e-commerce-ui",
        "featured": False,
    },
    {
        "slug": "blog-platform",
        "title": "Blog Platform",
        "description": "Plataforma de blog con CMS headless",
        "long_description": "Plataforma de blog construida con Astro y un CMS headless para gestión de contenido.",
        "category": "Fullstack",
        "tags": ["Astro", "Node.js", "PostgreSQL", "REST API"],
        "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        "demo_url": "https://github.com/Kevin848572/blog-platform",
        "github_url": "https://github.com/Kevin848572/blog-platform",
        "featured": False,
    },
    {
        "slug": "task-manager",
        "title": "Task Manager",
        "description": "Gestor de tareas con autenticación",
        "long_description": "Aplicación de gestión de tareas con autenticación de usuarios, categorías y prioridades.",
        "category": "Fullstack",
        "tags": ["React", "Node.js", "MongoDB", "JWT"],
        "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
        "demo_url": "https://github.com/Kevin848572/task-manager",
        "github_url": "https://github.com/Kevin848572/task-manager",
        "featured": False,
    },
    {
        "slug": "weather-app",
        "title": "Weather App",
        "description": "Aplicación del clima con geolocalización",
        "long_description": "Aplicación del clima que muestra pronósticos basados en la ubicación del usuario.",
        "category": "Frontend",
        "tags": ["JavaScript", "API REST", "HTML5", "CSS3"],
        "image": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
        "demo_url": "https://github.com/Kevin848572/weather-app",
        "github_url": "https://github.com/Kevin848572/weather-app",
        "featured": False,
    },
]


# ─── Datos extraídos de src/models/SkillModel.js ───
SKILL_CATEGORIES_DATA = [
    {
        "name": "Frontend Core & Rendimiento",
        "skills": [
            {"name": "Astro", "level": "Avanzado", "description": "Islands Architecture, SSG, SSR y optimización de assets"},
            {"name": "React", "level": "Avanzado", "description": "Hooks, Context, State Management y componentes reactivos"},
            {"name": "JavaScript", "level": "Avanzado", "description": "ES6+, Async/Await, DOM API y programación funcional"},
            {"name": "TypeScript", "level": "Avanzado", "description": "Tipado estático, interfaces, generics y utilidades de tipo"},
            {"name": "HTML5", "level": "Avanzado", "description": "Semántica, accesibilidad (a11y) y optimización SEO"},
            {"name": "CSS3", "level": "Avanzado", "description": "Flexbox, Grid, animaciones y arquitectura CSS escalable"},
        ],
    },
    {
        "name": "Frameworks UI & Animaciones",
        "skills": [
            {"name": "Tailwind CSS", "level": "Avanzado", "description": "Design tokens, custom themes y utilidades de diseño"},
            {"name": "GSAP", "level": "Avanzado", "description": "Animaciones cinematográficas, ScrollTrigger y timelines"},
            {"name": "Chart.js", "level": "Intermedio", "description": "Visualización de datos, gráficas interactivas y dashboards"},
            {"name": "Lenis", "level": "Avanzado", "description": "Smooth scroll de alto rendimiento a 120fps"},
        ],
    },
    {
        "name": "Herramientas, Cloud & Flujo",
        "skills": [
            {"name": "Git & GitHub", "level": "Avanzado", "description": "Control de versiones, branching strategies y CI/CD"},
            {"name": "Figma", "level": "Intermedio", "description": "Diseño UI/UX, prototipos y design systems"},
            {"name": "REST APIs", "level": "Avanzado", "description": "Consumo de APIs RESTful, manejo de endpoints y autenticación"},
            {"name": "Vercel", "level": "Avanzado", "description": "Deploy, hosting, edge functions y optimización de rendimiento"},
        ],
    },
]


# ─── Datos extraídos de src/models/ExperienceModel.js ───
EXPERIENCES_DATA = [
    {
        "year": "2026",
        "period": "2025 — Actualidad",
        "role": "Frontend & UI Specialist / Lead Web Architect",
        "company": "Proyectos Independientes & Consultoría Tech",
        "description": "Diseño y arquitectura de aplicaciones web de alto rendimiento con enfoque en experiencia de usuario.",
        "achievements": [
            "Desarrollo de portafolios y dashboards con Astro, React y GSAP con animaciones cinematográficas.",
            "Creación de arquitecturas modulares reutilizables y optimización de rendimiento web (Lighthouse 95+).",
            "Optimización de SEO técnico y implementación de Islands Architecture para carga ultra-rápida.",
        ],
        "tags": ["Astro", "React", "GSAP", "Tailwind CSS", "TypeScript", "Performance"],
    },
    {
        "year": "2024",
        "period": "2024 — 2025",
        "role": "Frontend Developer",
        "company": "Desarrollo Web Full-Time",
        "description": "Desarrollo de interfaces de usuario modernas, responsivas y accesibles para múltiples proyectos.",
        "achievements": [
            "Implementación de componentes UI reutilizables con React y Tailwind CSS.",
            "Integración de APIs RESTful y manejo de estado con hooks personalizados.",
            "Mejora de métricas de rendimiento: reducción del 40% en tiempo de carga.",
        ],
        "tags": ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Git"],
    },
    {
        "year": "2023",
        "period": "2023 — 2024",
        "role": "Web Development Intern",
        "company": "Primer contacto profesional",
        "description": "Aprendizaje intensivo de fundamentos de desarrollo web moderno y trabajo en equipo.",
        "achievements": [
            "Dominio de HTML5, CSS3 y JavaScript ES6+ en proyectos reales.",
            "Participación en desarrollo de interfaces responsivas y accesibles.",
            "Formación en metodologías ágiles y control de versiones con Git.",
        ],
        "tags": ["HTML5", "CSS3", "JavaScript", "Git", "Responsive Design"],
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Profile
        profile = Profile(**PROFILE_DATA)
        db.add(profile)

        # Projects
        for p in PROJECTS_DATA:
            db.add(Project(**p))

        # Skill Categories + Skills
        for cat_data in SKILL_CATEGORIES_DATA:
            category = SkillCategory(name=cat_data["name"])
            for s in cat_data["skills"]:
                category.skills.append(Skill(**s))
            db.add(category)

        # Experiences
        for exp_data in EXPERIENCES_DATA:
            achievements = exp_data.pop("achievements")
            experience = Experience(**exp_data)
            for ach_text in achievements:
                experience.achievements.append(ExperienceAchievement(text=ach_text))
            db.add(experience)

        # Admin user (default: admin/admin123)
        admin = User(
            username="admin",
            hashed_password=hash_password("admin123"),
        )
        db.add(admin)

        await db.commit()
        print("Seed completado exitosamente.")
        print("Usuario admin: admin / admin123")


if __name__ == "__main__":
    selector = selectors.DefaultSelector()
    loop = asyncio.SelectorEventLoop(selector)
    try:
        loop.run_until_complete(seed())
    finally:
        loop.close()
