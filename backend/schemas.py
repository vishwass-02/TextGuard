from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PredictionRequest(BaseModel):
    text: str

class Highlight(BaseModel):
    word: str
    weight: float

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    highlights: List[Highlight] = []
    explanation: Optional[str] = ""

class HistoryItem(BaseModel):
    id: int
    text: str
    type: str
    result: str
    confidence: float
    timestamp: datetime

    class Config:
        from_attributes = True
