from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional
from app.models.user import User
from app.models.diagnosis import CropDiagnosis
from app.models.chat import ChatHistory
from app.models.recommendation import Recommendation
from app.schemas.dashboard import DashboardSummaryResponse
from app.schemas.disease import DiagnosisHistoryOut
from app.schemas.chat import ChatHistoryOut
from app.schemas.recommendation import RecommendationHistoryOut
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/dashboard", tags=["Farmer Dashboard"])


@router.get("", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retrieve summarized statistics, recent diagnoses, chat logs, and quick tips."""
    user_id = current_user.id if current_user else None
    user_name = current_user.name if current_user else "Farmer"

    # Query counts
    diag_query = db.query(CropDiagnosis)
    chat_query = db.query(ChatHistory)
    rec_query = db.query(Recommendation)

    if user_id:
        diag_query = diag_query.filter(CropDiagnosis.user_id == user_id)
        chat_query = chat_query.filter(ChatHistory.user_id == user_id)
        rec_query = rec_query.filter(Recommendation.user_id == user_id)

    total_diag = diag_query.count()
    total_chat = chat_query.count()
    total_rec = rec_query.count()

    recent_diag = diag_query.order_by(CropDiagnosis.created_at.desc()).limit(5).all()
    recent_chat = chat_query.order_by(ChatHistory.created_at.desc()).limit(5).all()
    recent_recs = rec_query.order_by(Recommendation.created_at.desc()).limit(5).all()

    # Weather
    lat = current_user.latitude if (current_user and current_user.latitude) else 10.8505
    lon = current_user.longitude if (current_user and current_user.longitude) else 76.2711
    loc = current_user.location if (current_user and current_user.location) else "Palakkad, Kerala"

    weather = await WeatherService.get_weather(latitude=lat, longitude=lon, location_name=loc)

    quick_tips = [
        {
            "title": "Monsoon Preparation",
            "title_ml": "മഴക്കാല മുന്നൊരുക്കം",
            "tip": "Ensure adequate soil drainage channels across banana, pepper, and ginger beds to avoid fungal collar rot.",
            "tip_ml": "വാഴ, കുരുമുളക്, ഇഞ്ചി തടങ്ങളിൽ വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ നീർവാർച്ച ചാലുകൾ വൃത്തിയാക്കുക."
        },
        {
            "title": "Bio-control Application",
            "title_ml": "ജീവാണു പ്രയോഗം",
            "tip": "Apply Pseudomonas fluorescens (20g/L) monthly to build systemic immunity in vegetables.",
            "tip_ml": "പച്ചക്കറികളിൽ രോഗപ്രതിരോധത്തിനായി മാസം തോറും സ്യൂഡോമോണസ് തളിക്കുക."
        },
        {
            "title": "Organic Soil Enrichment",
            "title_ml": "മണ്ണ് പരിപാലനം",
            "tip": "Add Neem cake to basal manure to safeguard root systems from plant parasitic nematodes.",
            "tip_ml": "നിമാവിരകളെ തടയാൻ അടിവളത്തോടൊപ്പം വേപ്പിൻ പിണ്ണാക്ക് ചേർത്തു കൊടുക്കുക."
        }
    ]

    return DashboardSummaryResponse(
        user_name=user_name,
        total_diagnoses=total_diag,
        total_chats=total_chat,
        total_recommendations=total_rec,
        recent_diagnoses=[DiagnosisHistoryOut.model_validate(d) for d in recent_diag],
        recent_chats=[ChatHistoryOut.model_validate(c) for c in recent_chat],
        recent_recommendations=[RecommendationHistoryOut.model_validate(r) for r in recent_recs],
        current_weather=weather,
        quick_tips=quick_tips
    )
