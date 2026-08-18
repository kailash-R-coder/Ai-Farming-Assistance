from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class RemedyInfo(BaseModel):
    organic: List[str] = Field(default_factory=list)
    chemical_advisory: str = Field(...)
    prevention: List[str] = Field(default_factory=list)


class DiseasePredictionResponse(BaseModel):
    crop: str = Field(..., examples=["Tomato"])
    crop_ml: Optional[str] = Field(None, examples=["തക്കാളി"])
    disease: str = Field(..., examples=["Early Blight"])
    disease_ml: Optional[str] = Field(None, examples=["ഏർളി ബ്ലൈറ്റ് (ഇല കരിച്ചിൽ)"])
    confidence: float = Field(..., examples=[94.2])
    is_confident: bool = Field(..., examples=[True])
    warning: Optional[str] = None
    symptoms: List[str] = Field(default_factory=list)
    symptoms_ml: List[str] = Field(default_factory=list)
    recommendations: RemedyInfo
    recommendations_ml: Optional[RemedyInfo] = None
    image_url: Optional[str] = None
    disclaimer: str = Field(
        default="AI predictions are assistive decision-support tools. For severe infections or large acreage, consult your local Krishi Bhavan / Agricultural Officer."
    )


class DiagnosisHistoryOut(BaseModel):
    id: str
    image_path: str
    crop: str
    disease: str
    confidence: float
    symptoms: Optional[Any] = None
    recommendations: Optional[Any] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
