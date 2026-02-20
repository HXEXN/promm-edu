from pydantic import BaseModel
from typing import Optional, Any, Dict, List
import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserResponse(UserBase):
    id: int
    progress: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}

class PromptResponse(BaseModel):
    id: int
    user_id: int
    role_text: Optional[str] = None
    context_text: Optional[str] = None
    action_text: Optional[str] = None
    model_used: Optional[str] = None
    token_count: Optional[int] = None
    efficiency_score: Optional[int] = None
    hardware_command: Optional[str] = None
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
