import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .routers import auth, users, matches, connections
from . import models

Base.metadata.create_all(bind=engine)

DEFAULT_SKILLS = [
    "python", "javascript", "typescript", "react", "node.js", "fastapi", "django",
    "flutter", "figma", "ui/ux design", "machine learning", "data analysis", "sql",
    "product management", "public speaking", "video editing", "aws", "docker",
    "solidity", "marketing", "content writing", "c++", "android", "ios", "unity",
]


def _seed_skills():
    db = SessionLocal()
    try:
        if db.query(models.Skill).count() == 0:
            db.add_all([models.Skill(name=name) for name in DEFAULT_SKILLS])
            db.commit()
    finally:
        db.close()


_seed_skills()

app = FastAPI(
    title="Sathio API",
    description="Find your missing teammate — connect over shared skills and interests.",
    version="1.0.0",
)

# Comma-separated list of allowed origins, e.g. "https://sathio.onrender.com,http://localhost:5173"
origins_env = os.getenv("CORS_ORIGINS", "*")
allow_origins = ["*"] if origins_env.strip() == "*" else [o.strip() for o in origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(matches.router)
app.include_router(connections.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "sathio-api"}
