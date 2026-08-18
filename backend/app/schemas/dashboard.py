from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.disease import DiagnosisHistoryOut
from app.schemas.chat import ChatHistoryOut
from app.schemas.recommendation import RecommendationHistoryOut
from app.schemas.weather import WeatherResponse


class DashboardSummaryResponse(BaseModel):
    user_name: Optional[str] = "Farmer"
    total_diagnoses: int
    total_chats: int
    total_recommendations: int
    recent_diagnoses: List[DiagnosisHistoryOut] = []
    recent_chats: List[ChatHistoryOut] = []
    recent_recommendations: List[RecommendationHistoryOut] = []
    current_weather: Optional[WeatherResponse] = None
    quick_tips: List[Dict[str, str]] = []
