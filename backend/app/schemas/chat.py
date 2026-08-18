from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ChatMessageInput(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, examples=["My tomato leaves are turning yellow"])
    language: Optional[str] = Field(default="auto", examples=["en", "ml", "auto"])


class ChatSource(BaseModel):
    title: str
    category: str
    relevance: str


class ChatResponse(BaseModel):
    answer: str
    language: str
    audio_transcription: Optional[str] = None
    sources: List[ChatSource] = Field(default_factory=list)
    confidence: float = 0.95
    disclaimer: str = "Always consult certified agricultural officers before applying chemical pesticides."


class ChatHistoryOut(BaseModel):
    id: str
    question: str
    answer: str
    language: str
    sources: Optional[List[dict]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
