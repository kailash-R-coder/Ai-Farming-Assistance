from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class WeatherQueryInput(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, examples=[10.8505])
    longitude: float = Field(..., ge=-180, le=180, examples=[76.2711])
    location_name: Optional[str] = Field(default="Kerala, India")


class HourlyForecast(BaseModel):
    time: str
    temperature: float
    precipitation_prob: float
    humidity: float


class DailyForecastItem(BaseModel):
    date: str
    max_temp: float
    min_temp: float
    precipitation_sum: float
    precipitation_probability: float
    weather_code: int
    condition: str


class WeatherResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    current_temperature: float
    humidity: float
    precipitation_mm: float
    wind_speed_kmh: float
    condition: str
    condition_ml: Optional[str] = None
    icon: str
    agricultural_advisories: List[str]
    agricultural_advisories_ml: List[str]
    forecast_daily: List[DailyForecastItem] = Field(default_factory=list)


class WeatherHistoryOut(BaseModel):
    id: str
    location: str
    temperature: float
    humidity: float
    rainfall: float
    wind_speed: Optional[float] = None
    condition: Optional[str] = None
    advisory: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
