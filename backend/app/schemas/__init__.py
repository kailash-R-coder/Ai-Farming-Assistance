from app.schemas.user import UserBase, UserCreate, UserLogin, UserOut, UserUpdate, Token, TokenPayload
from app.schemas.disease import DiseasePredictionResponse, DiagnosisHistoryOut, RemedyInfo
from app.schemas.chat import ChatMessageInput, ChatResponse, ChatHistoryOut
from app.schemas.recommendation import (
    CropRecommendInput, CropRecommendResponse,
    FertilizerRecommendInput, FertilizerRecommendResponse,
    IrrigationRecommendInput, IrrigationRecommendResponse,
    RecommendationHistoryOut
)
from app.schemas.weather import WeatherQueryInput, WeatherResponse, WeatherHistoryOut
from app.schemas.dashboard import DashboardSummaryResponse

__all__ = [
    "UserBase", "UserCreate", "UserLogin", "UserOut", "UserUpdate", "Token", "TokenPayload",
    "DiseasePredictionResponse", "DiagnosisHistoryOut", "RemedyInfo",
    "ChatMessageInput", "ChatResponse", "ChatHistoryOut",
    "CropRecommendInput", "CropRecommendResponse",
    "FertilizerRecommendInput", "FertilizerRecommendResponse",
    "IrrigationRecommendInput", "IrrigationRecommendResponse",
    "RecommendationHistoryOut",
    "WeatherQueryInput", "WeatherResponse", "WeatherHistoryOut",
    "DashboardSummaryResponse"
]
