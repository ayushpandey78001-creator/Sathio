import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Table, Enum, UniqueConstraint
)
from sqlalchemy.orm import relationship
import enum

from .database import Base


# Many-to-many: User <-> Skill, with a proficiency level stored on the link
class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency = Column(Integer, default=3)  # 1 (beginner) - 5 (expert)

    user = relationship("User", back_populates="skill_links")
    skill = relationship("Skill", back_populates="user_links")

    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=True, nullable=False, index=True)

    user_links = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")


class ConnectionStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"


class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    requester = relationship("User", foreign_keys=[requester_id], back_populates="sent_connections")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_connections")

    __table_args__ = (UniqueConstraint("requester_id", "receiver_id", name="uq_connection_pair"),)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    college = Column(String(255), default="")
    bio = Column(Text, default="")
    looking_for = Column(String(255), default="")  # comma-separated: hackathons,startup,research,side-project
    portfolio_url = Column(String(255), default="")
    avatar_seed = Column(String(64), default="")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    skill_links = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")

    sent_connections = relationship(
        "Connection", foreign_keys=[Connection.requester_id], back_populates="requester",
        cascade="all, delete-orphan"
    )
    received_connections = relationship(
        "Connection", foreign_keys=[Connection.receiver_id], back_populates="receiver",
        cascade="all, delete-orphan"
    )
    
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
