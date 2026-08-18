from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class CropRecommendInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=300, examples=[90.0], description="Soil Nitrogen (N) in mg/kg or kg/ha")
    phosphorus: float = Field(..., ge=0, le=300, examples=[42.0], description="Soil Phosphorus (P) in mg/kg or kg/ha")
    potassium: float = Field(..., ge=0, le=300, examples=[43.0], description="Soil Potassium (K) in mg/kg or kg/ha")
    temperature: float = Field(..., ge=-10, le=60, examples=[25.5], description="Average Temperature in °C")
    humidity: float = Field(..., ge=0, le=100, examples=[80.0], description="Relative Humidity in %")
    ph: float = Field(..., ge=1, le=14, examples=[6.5], description="Soil pH Level (1-14)")
    rainfall: float = Field(..., ge=0, le=3000, examples=[200.0], description="Annual / Seasonal Rainfall in mm")


class CropAlternative(BaseModel):
    crop: str
    crop_ml: Optional[str] = None
    confidence: float
    reason: str


class CropRecommendResponse(BaseModel):
    recommended_crop: str
    recommended_crop_ml: Optional[str] = None
    confidence: float
    alternatives: List[CropAlternative] = Field(default_factory=list)
    soil_health_assessment: str
    suitable_seasons: List[str] = Field(default_factory=list)
    kerala_suitability: str


class FertilizerRecommendInput(BaseModel):
    crop: str = Field(..., examples=["Rice / Paddy", "Coconut", "Banana", "Tomato", "Pepper"])
    soil_n: float = Field(..., ge=0, le=300, examples=[80.0])
    soil_p: float = Field(..., ge=0, le=300, examples=[30.0])
    soil_k: float = Field(..., ge=0, le=300, examples=[40.0])
    soil_ph: Optional[float] = Field(default=6.5, ge=1, le=14)
    growth_stage: str = Field(default="Vegetative", examples=["Basal / Sowing", "Vegetative", "Flowering", "Fruiting / Maturation"])


class FertilizerOption(BaseModel):
    name: str
    dosage: str
    timing: str


class FertilizerRecommendResponse(BaseModel):
    crop: str
    crop_ml: Optional[str] = None
    nutrient_status: Dict[str, str]  # e.g., {"N": "Deficient", "P": "Optimal", "K": "Deficient"}
    organic_recommendations: List[FertilizerOption]
    mineral_recommendations: List[FertilizerOption]
    soil_conditioning: Optional[str] = None
    application_guidelines: str
    warnings: List[str] = Field(default_factory=list)


class IrrigationRecommendInput(BaseModel):
    crop: str = Field(..., examples=["Banana", "Coconut", "Paddy", "Vegetables", "Pepper"])
    soil_type: str = Field(..., examples=["Laterite", "Loamy", "Clay", "Sandy", "Alluvial"])
    temperature: float = Field(..., ge=-10, le=60, examples=[31.0])
    humidity: float = Field(..., ge=0, le=100, examples=[65.0])
    rainfall_forecast_mm: float = Field(default=0.0, ge=0, le=500, examples=[5.0])
    recent_irrigation_days_ago: int = Field(default=2, ge=0, le=30, examples=[2])


class IrrigationRecommendResponse(BaseModel):
    irrigation_required: bool
    status_text: str
    status_text_ml: Optional[str] = None
    recommended_timing: str
    estimated_water_liters_per_plant_or_sqm: str
    reason: str
    reason_ml: Optional[str] = None
    rain_impact: str
    best_practice_tips: List[str] = Field(default_factory=list)


class RecommendationHistoryOut(BaseModel):
    id: str
    recommendation_type: str
    input_data: Dict[str, Any]
    result: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
