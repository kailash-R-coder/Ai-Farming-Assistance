from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional, get_current_user
from app.models.weather import WeatherHistory
from app.models.user import User
from app.schemas.weather import WeatherResponse, WeatherHistoryOut
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather Advisory"])


@router.get("", response_model=WeatherResponse)
async def get_live_weather(
    latitude: float = Query(default=10.8505, ge=-90, le=90, description="Latitude (default: Kerala)"),
    longitude: float = Query(default=76.2711, ge=-180, le=180, description="Longitude (default: Kerala)"),
    location: str = Query(default="Kerala, India", description="Human-readable location"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Fetch live hyperlocal weather from Open-Meteo and generate farming advisories
    (monsoon management, pest risk, irrigation adjustments).
    """
    weather_data = await WeatherService.get_weather(
        latitude=latitude,
        longitude=longitude,
        location_name=location
    )

    # Optionally log to weather history if user logged in
    if current_user:
        advisory_summary = " | ".join(weather_data.get("agricultural_advisories", []))
        log = WeatherHistory(
            user_id=current_user.id,
            location=location,
            temperature=weather_data["current_temperature"],
            humidity=weather_data["humidity"],
            rainfall=weather_data["precipitation_mm"],
            wind_speed=weather_data["wind_speed_kmh"],
            condition=weather_data["condition"],
            advisory=advisory_summary
        )
        db.add(log)
        db.commit()

    return weather_data


@router.get("/history", response_model=List[WeatherHistoryOut])
def get_weather_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch recent weather logs for the farmer."""
    logs = (
        db.query(WeatherHistory)
        .filter(WeatherHistory.user_id == current_user.id)
        .order_by(WeatherHistory.created_at.desc())
        .limit(30)
        .all()
    )
    return logs
