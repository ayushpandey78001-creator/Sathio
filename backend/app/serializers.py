from . import models
from .matching import compute_rating_score


def serialize_user(user: models.User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "college": user.college or "",
        "bio": user.bio or "",
        "looking_for": [i for i in (user.looking_for or "").split(",") if i],
        "portfolio_url": user.portfolio_url or "",
        "rating_score": compute_rating_score(user),
        "skills": [
            {"name": link.skill.name, "proficiency": link.proficiency}
            for link in (user.skill_links or [])
        ],
        "created_at": user.created_at,
    }
