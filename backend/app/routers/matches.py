from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user
from ..serializers import serialize_user
from ..matching import compute_match

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("", response_model=List[schemas.MatchOut])
def discover_matches(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Exclude self, and exclude anyone already connected (pending or accepted)
    connected_ids = set()
    for c in current_user.sent_connections:
        connected_ids.add(c.receiver_id)
    for c in current_user.received_connections:
        connected_ids.add(c.requester_id)

    candidates = (
        db.query(models.User)
        .filter(models.User.id != current_user.id)
        .filter(~models.User.id.in_(connected_ids) if connected_ids else True)
        .all()
    )

    results = []
    for candidate in candidates:
        score, shared_skills, shared_interests = compute_match(current_user, candidate)
        results.append(
            {
                "user": serialize_user(candidate),
                "match_score": score,
                "shared_skills": shared_skills,
                "shared_interests": shared_interests,
            }
        )

    results.sort(key=lambda r: r["match_score"], reverse=True)
    return results
