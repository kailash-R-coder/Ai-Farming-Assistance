"""
Crop Recommendation Model Training Script using Random Forest Classifier
"""
import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


def train_crop_model():
    print("Generating agronomic training dataset...")
    # Generate balanced agronomic dataset
    from backend.app.ml.crop_recommender import CROP_METADATA

    # Train model
    from backend.app.ml.crop_recommender import crop_recommender
    print(f"Random Forest Crop Recommender trained with classes: {crop_recommender.classes_}")

    save_path = os.path.join(os.path.dirname(__file__), "../backend/app/ml/saved_models/crop_rf_model.joblib")
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump(crop_recommender.model, save_path)
    print(f"Saved Random Forest Crop model to {save_path}")


if __name__ == "__main__":
    train_crop_model()
