from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional, get_current_user
from app.models.recommendation import Recommendation
from app.models.user import User
from app.schemas.recommendation import (
    CropRecommendInput, CropRecommendResponse,
    FertilizerRecommendInput, FertilizerRecommendResponse,
    IrrigationRecommendInput, IrrigationRecommendResponse,
    RecommendationHistoryOut
)
from app.ml.crop_recommender import crop_recommender
from app.services.advisory_service import AdvisoryService

router = APIRouter(tags=["Agricultural Recommendations"])


@router.post("/crop/recommend", response_model=CropRecommendResponse)
def get_crop_recommendation(
    data: CropRecommendInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Predict top recommended crops and alternatives based on Soil NPK, pH, and climate."""
    result = crop_recommender.recommend(
        nitrogen=data.nitrogen,
        phosphorus=data.phosphorus,
        potassium=data.potassium,
        temperature=data.temperature,
        humidity=data.humidity,
        ph=data.ph,
        rainfall=data.rainfall
    )

    # Persist in DB
    rec_record = Recommendation(
        user_id=current_user.id if current_user else None,
        recommendation_type="crop",
        input_data=data.model_dump(),
        result=result
    )
    db.add(rec_record)
    db.commit()

    return result


@router.post("/fertilizer/recommend", response_model=FertilizerRecommendResponse)
def get_fertilizer_recommendation(
    data: FertilizerRecommendInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Calculate nutrient deficiencies, organic composts, and balanced mineral formulations."""
    result = AdvisoryService.calculate_fertilizer(
        crop=data.crop,
        soil_n=data.soil_n,
        soil_p=data.soil_p,
        soil_k=data.soil_k,
        soil_ph=data.soil_ph or 6.5,
        growth_stage=data.growth_stage
    )

    rec_record = Recommendation(
        user_id=current_user.id if current_user else None,
        recommendation_type="fertilizer",
        input_data=data.model_dump(),
        result=result
    )
    db.add(rec_record)
    db.commit()

    return result


@router.post("/irrigation/recommend", response_model=IrrigationRecommendResponse)
def get_irrigation_recommendation(
    data: IrrigationRecommendInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Determine irrigation requirement, water volume, and optimal timing."""
    result = AdvisoryService.calculate_irrigation(
        crop=data.crop,
        soil_type=data.soil_type,
        temperature=data.temperature,
        humidity=data.humidity,
        rainfall_forecast_mm=data.rainfall_forecast_mm,
        recent_irrigation_days_ago=data.recent_irrigation_days_ago
    )

    rec_record = Recommendation(
        user_id=current_user.id if current_user else None,
        recommendation_type="irrigation",
        input_data=data.model_dump(),
        result=result
    )
    db.add(rec_record)
    db.commit()

    return result


@router.get("/recommendations/history", response_model=List[RecommendationHistoryOut])
def get_recommendations_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve previous crop, fertilizer, and irrigation recommendation logs."""
    history = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.created_at.desc())
        .limit(50)
        .all()
    )
    return history
