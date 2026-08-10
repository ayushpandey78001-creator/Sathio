from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user
from ..serializers import serialize_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/me", response_model=schemas.UserOut)
def update_me(
    payload: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.college is not None:
        current_user.college = payload.college
    if payload.portfolio_url is not None:
        current_user.portfolio_url = payload.portfolio_url
    if payload.looking_for is not None:
        current_user.looking_for = ",".join(
            sorted({i.strip().lower() for i in payload.looking_for if i.strip()})
        )

    if payload.skills is not None:
        # Replace the user's skill set entirely with the submitted list.
        current_user.skill_links.clear()
        db.flush()
        for skill_in in payload.skills:
            name = skill_in.name.strip().lower()
            if not name:
                continue
            skill = db.query(models.Skill).filter(models.Skill.name == name).first()
            if not skill:
                skill = models.Skill(name=name)
                db.add(skill)
                db.flush()
            link = models.UserSkill(
                user_id=current_user.id, skill_id=skill.id, proficiency=skill_in.proficiency
            )
            db.add(link)

    db.commit()
    db.refresh(current_user)
    return serialize_user(current_user)


@router.get("/skills/catalog", response_model=list[schemas.SkillOut])
def skill_catalog(db: Session = Depends(get_db)):
    """A starter list of common skills, to power an autocomplete on the frontend."""
    existing = db.query(models.Skill).order_by(models.Skill.name).all()
    return existing
