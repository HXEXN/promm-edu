from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    progress = Column(Text, default='{}')
    created_at = Column(DateTime, default=func.now())

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    role_text = Column(Text)
    context_text = Column(Text)
    action_text = Column(Text)
    model_used = Column(String)
    token_count = Column(Integer)
    efficiency_score = Column(Integer)
    hardware_command = Column(Text)
    created_at = Column(DateTime, default=func.now())

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    order_index = Column(Integer)
    difficulty = Column(String)
    goal = Column(Text)
    hints = Column(Text)
    validation_rules = Column(Text)
    example_role = Column(Text)
    example_context = Column(Text)
    example_action = Column(Text)
