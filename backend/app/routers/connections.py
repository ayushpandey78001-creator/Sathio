from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user
from ..serializers import serialize_user

router = APIRouter(prefix="/connections", tags=["connections"])


def _to_out(conn: models.Connection, current_user_id: int) -> dict:
    other = conn.receiver if conn.requester_id == current_user_id else conn.requester
    return {
        "id": conn.id,
        "status": conn.status.value,
        "created_at": conn.created_at,
        "other_user": serialize_user(other),
    }


@router.get("", response_model=List[schemas.ConnectionOut])
def list_connections(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    conns = (
        db.query(models.Connection)
        .filter(
            or_(
                models.Connection.requester_id == current_user.id,
                models.Connection.receiver_id == current_user.id,
            )
        )
        .order_by(models.Connection.created_at.desc())
        .all()
    )
    return [_to_out(c, current_user.id) for c in conns]


@router.post("/request/{user_id}", response_model=schemas.ConnectionOut, status_code=201)
def send_request(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't connect with yourself")

    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = (
        db.query(models.Connection)
        .filter(
            or_(
                (models.Connection.requester_id == current_user.id) & (models.Connection.receiver_id == user_id),
                (models.Connection.requester_id == user_id) & (models.Connection.receiver_id == current_user.id),
            )
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="A connection already exists with this user")

    conn = models.Connection(requester_id=current_user.id, receiver_id=user_id)
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return _to_out(conn, current_user.id)


@router.put("/{connection_id}/respond", response_model=schemas.ConnectionOut)
def respond_to_request(
    connection_id: int,
    accept: bool,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    conn = db.query(models.Connection).filter(models.Connection.id == connection_id).first()
    if not conn or conn.receiver_id != current_user.id:
        raise HTTPException(status_code=404, detail="Connection request not found")

    conn.status = models.ConnectionStatus.accepted if accept else models.ConnectionStatus.declined
    db.commit()
    db.refresh(conn)
    return _to_out(conn, current_user.id)
