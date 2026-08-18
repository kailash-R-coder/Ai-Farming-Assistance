import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional, get_current_user
from app.config import settings
from app.models.diagnosis import CropDiagnosis
from app.models.user import User
from app.schemas.disease import DiseasePredictionResponse, DiagnosisHistoryOut
from app.ml.disease_classifier import disease_classifier

router = APIRouter(prefix="/disease", tags=["Crop Disease Detection"])


@router.post("/predict", response_model=DiseasePredictionResponse)
async def predict_crop_disease(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Upload a leaf/crop image to detect plant diseases, confidence score, symptoms,
    and organic/chemical remedies in English and Malayalam.
    """
    # 1. Validate MIME type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a JPEG or PNG image."
        )

    # 2. Read image bytes
    contents = await file.read()
    max_size_bytes = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
    if len(contents) > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds limit of {settings.MAX_IMAGE_SIZE_MB}MB."
        )

    # 3. Save image locally
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    # 4. Execute ML inference
    try:
        prediction_result = disease_classifier.predict(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing disease model inference: {str(e)}"
        )

    # 5. Persist diagnosis in database
    diagnosis_record = CropDiagnosis(
        user_id=current_user.id if current_user else None,
        image_path=f"/uploads/{filename}",
        crop=prediction_result["crop"],
        disease=prediction_result["disease"],
        confidence=prediction_result["confidence"],
        symptoms=prediction_result["symptoms"],
        recommendations=prediction_result["recommendations"]
    )
    db.add(diagnosis_record)
    db.commit()
    db.refresh(diagnosis_record)

    prediction_result["image_url"] = f"/uploads/{filename}"
    return prediction_result


@router.get("/history", response_model=List[DiagnosisHistoryOut])
def get_diagnosis_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve historical leaf diagnoses for the authenticated farmer."""
    records = (
        db.query(CropDiagnosis)
        .filter(CropDiagnosis.user_id == current_user.id)
        .order_by(CropDiagnosis.created_at.desc())
        .limit(50)
        .all()
    )
    return records
