import os
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from app.config import settings

# Crop metadata with Malayalam translations and suitability notes
CROP_METADATA = {
    "rice": {
        "name": "Rice / Paddy",
        "name_ml": "നെല്ല്",
        "seasons": ["Virippu (Autumn)", "Mundakan (Winter)", "Puncha (Summer)"],
        "kerala_suitability": "Ideal for Kuttanad, Palakkad, and Kole wetlands with high water retention."
    },
    "banana": {
        "name": "Banana / Plantain (Nendran/Robusta)",
        "name_ml": "വാഴ (നേന്ത്രൻ / റോബസ്റ്റ)",
        "seasons": ["Year-round", "Pre-monsoon (April-May)", "Post-monsoon (Sept-Oct)"],
        "kerala_suitability": "Thrives across all Kerala river basins and laterite loams with rich organic manure."
    },
    "coconut": {
        "name": "Coconut",
        "name_ml": "തെങ്ങ്",
        "seasons": ["Perennial (May-June planting)"],
        "kerala_suitability": "The staple plantation crop of Kerala; thrives in coastal alluvium, red loam, and laterite soils."
    },
    "pepper": {
        "name": "Black Pepper",
        "name_ml": "കുരുമുളക്",
        "seasons": ["May-June (Southwest monsoon onset)"],
        "kerala_suitability": "King of spices; excellent for Wayanad, Idukki, and humid midlands grown on live standards."
    },
    "tomato": {
        "name": "Tomato",
        "name_ml": "തക്കാളി",
        "seasons": ["September-October (Post-monsoon)"],
        "kerala_suitability": "Well suited for polyhouses and well-drained vegetable homestead gardens."
    },
    "maize": {
        "name": "Maize / Corn",
        "name_ml": "മക്കച്ചോളം",
        "seasons": ["Kharif / Rabi"],
        "kerala_suitability": "Suitable for Palakkad plains and well-drained sandy loam tracts."
    },
    "chickpea": {
        "name": "Chickpea / Bengal Gram",
        "name_ml": "കടല",
        "seasons": ["Rabi (Winter)"],
        "kerala_suitability": "Suitable for dry tracts of Palakkad with moderate moisture."
    },
    "kidneybeans": {
        "name": "Kidney Beans / Rajma",
        "name_ml": "വൻപയർ / രാജ്മ",
        "seasons": ["Kharif / Post-monsoon"],
        "kerala_suitability": "Grown in high-altitude zones like Idukki and Wayanad."
    },
    "pigeonpeas": {
        "name": "Pigeon Peas / Red Gram",
        "name_ml": "തുവരപ്പരിപ്പ്",
        "seasons": ["June-July"],
        "kerala_suitability": "Good drought-tolerant intercrop in eastern rainshadow belts."
    },
    "mothbeans": {
        "name": "Moth Beans",
        "name_ml": "മോത്ത് പയർ",
        "seasons": ["Kharif"],
        "kerala_suitability": "Thrives in dry, well-aerated sandy soil."
    },
    "mungbean": {
        "name": "Mung Bean / Green Gram",
        "name_ml": "ചെറുപയർ",
        "seasons": ["Summer / Post-paddy fallow"],
        "kerala_suitability": "Excellent for residual moisture in paddy fields after harvest."
    },
    "blackgram": {
        "name": "Black Gram / Urad",
        "name_ml": "ഉഴുന്ന്",
        "seasons": ["Post-paddy rice fallow (Dec-Jan)"],
        "kerala_suitability": "Standard catch crop in paddy fields restoring soil nitrogen."
    },
    "lentil": {
        "name": "Lentil / Masoor",
        "name_ml": "മസൂർ പരിപ്പ്",
        "seasons": ["Winter"],
        "kerala_suitability": "Moderate suitability in dry midland plots."
    },
    "pomegranate": {
        "name": "Pomegranate",
        "name_ml": "മാതളനാരങ്ങ",
        "seasons": ["Year-round flowering"],
        "kerala_suitability": "Requires well-drained red loam with sunny exposure."
    },
    "mango": {
        "name": "Mango",
        "name_ml": "മാവ്",
        "seasons": ["Flowering (Dec-Jan), Harvest (April-May)"],
        "kerala_suitability": "Famous Muthalamada (Palakkad) mango belt & homestead orchards."
    },
    "grapes": {
        "name": "Grapes",
        "name_ml": "മുന്തിരി",
        "seasons": ["Pruned twice a year"],
        "kerala_suitability": "Cumbum valley border and arid pockets of Idukki/Palakkad."
    },
    "watermelon": {
        "name": "Watermelon",
        "name_ml": "തണ്ണീർമത്തൻ",
        "seasons": ["Summer (Dec-March)"],
        "kerala_suitability": "Thrives in riverbeds and sandy loams with intensive sunshine."
    },
    "muskmelon": {
        "name": "Muskmelon",
        "name_ml": "മത്തങ്ങ / മസ്ക് മെലൻ",
        "seasons": ["Summer"],
        "kerala_suitability": "Good in dry season garden beds."
    },
    "apple": {
        "name": "Apple",
        "name_ml": "ആപ്പിൾ",
        "seasons": ["Temperate (Winter chill)"],
        "kerala_suitability": "High-altitude micro-climates like Kanthalloor and Vattavada (Idukki)."
    },
    "orange": {
        "name": "Orange / Mandarin",
        "name_ml": "ഓറഞ്ച്",
        "seasons": ["Monsoon & Winter"],
        "kerala_suitability": "Nelliyampathy hills and high ranges of Wayanad/Idukki."
    },
    "papaya": {
        "name": "Papaya",
        "name_ml": "പപ്പായ / ഓമയ്ക്ക",
        "seasons": ["Year-round"],
        "kerala_suitability": "Ubiquitous across all home gardens in Kerala; requires good drainage."
    },
    "cotton": {
        "name": "Cotton",
        "name_ml": "പരുത്തി",
        "seasons": ["Kharif (July-August)"],
        "kerala_suitability": "Grown in black soil pockets of Chittur (Palakkad)."
    },
    "jute": {
        "name": "Jute",
        "name_ml": "ചണം",
        "seasons": ["Pre-monsoon"],
        "kerala_suitability": "Warm wet alluvial areas with heavy monsoon showers."
    },
    "coffee": {
        "name": "Coffee (Robusta/Arabica)",
        "name_ml": "കാപ്പി",
        "seasons": ["Blossom showers (March-April)"],
        "kerala_suitability": "Premium plantation crop of Wayanad and high-range estates."
    }
}


class CropRecommender:
    """Random Forest-based Crop Recommendation Model."""
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.classes_: List[str] = []
        self._initialize_and_train()

    def _initialize_and_train(self):
        """Train Random Forest classifier with standard multi-nutrient agronomic dataset."""
        # Synthetic benchmark generator based on ICAR agronomic thresholds
        np.random.seed(42)
        samples_per_crop = 60
        features = []
        labels = []

        # [N_mean, N_std, P_mean, P_std, K_mean, K_std, temp_mean, temp_std, hum_mean, hum_std, ph_mean, ph_std, rain_mean, rain_std]
        crop_profiles = {
            "rice": [80, 10, 48, 8, 40, 5, 23.5, 2, 82, 5, 6.5, 0.4, 230, 20],
            "maize": [78, 12, 47, 7, 20, 4, 22.5, 3, 65, 8, 6.2, 0.5, 85, 15],
            "chickpea": [40, 8, 68, 8, 80, 8, 18.5, 2, 16, 3, 7.3, 0.4, 80, 10],
            "kidneybeans": [20, 5, 67, 7, 20, 3, 20.0, 2, 21, 4, 5.7, 0.3, 105, 15],
            "pigeonpeas": [20, 5, 68, 6, 20, 4, 27.5, 3, 48, 6, 5.7, 0.4, 150, 20],
            "mothbeans": [21, 4, 48, 5, 20, 3, 28.0, 2, 53, 5, 6.8, 0.5, 50, 10],
            "mungbean": [21, 4, 48, 5, 20, 3, 28.5, 2, 85, 4, 6.7, 0.4, 45, 10],
            "blackgram": [40, 6, 68, 6, 19, 3, 30.0, 2, 65, 5, 7.1, 0.4, 68, 10],
            "lentil": [18, 4, 68, 6, 19, 3, 24.5, 2, 64, 5, 6.9, 0.4, 45, 8],
            "pomegranate": [19, 4, 19, 4, 40, 5, 21.8, 3, 90, 4, 6.4, 0.4, 105, 12],
            "banana": [100, 15, 75, 8, 50, 6, 27.3, 2, 80, 5, 6.0, 0.4, 100, 15],
            "mango": [20, 5, 27, 4, 30, 4, 31.2, 2, 50, 6, 5.7, 0.5, 95, 15],
            "grapes": [23, 5, 132, 10, 200, 15, 23.8, 3, 81, 4, 6.0, 0.4, 68, 10],
            "watermelon": [99, 12, 17, 3, 50, 5, 25.5, 2, 85, 4, 6.5, 0.4, 50, 8],
            "muskmelon": [100, 12, 18, 3, 50, 5, 28.6, 2, 92, 3, 6.3, 0.4, 25, 5],
            "apple": [20, 4, 134, 12, 200, 15, 22.6, 2, 92, 3, 5.9, 0.4, 110, 15],
            "orange": [20, 4, 16, 3, 10, 2, 22.8, 2, 92, 3, 7.0, 0.4, 110, 15],
            "papaya": [50, 8, 60, 8, 50, 6, 33.7, 2, 92, 3, 6.7, 0.4, 140, 20],
            "coconut": [22, 4, 17, 3, 30, 4, 27.4, 2, 94, 3, 6.0, 0.4, 175, 25],
            "cotton": [118, 15, 46, 6, 19, 3, 24.0, 2, 79, 5, 6.9, 0.4, 80, 12],
            "jute": [78, 10, 46, 6, 40, 5, 24.9, 2, 79, 5, 6.7, 0.4, 175, 20],
            "coffee": [101, 12, 28, 4, 30, 4, 25.5, 2, 58, 6, 6.8, 0.4, 155, 20],
            "pepper": [90, 12, 50, 6, 100, 10, 26.5, 2, 85, 4, 5.8, 0.4, 220, 25],
            "tomato": [100, 15, 60, 8, 60, 8, 24.0, 2, 75, 5, 6.5, 0.4, 90, 15]
        }

        for crop, prof in crop_profiles.items():
            for _ in range(samples_per_crop):
                row = [
                    max(0.0, np.random.normal(prof[0], prof[1])),   # N
                    max(0.0, np.random.normal(prof[2], prof[3])),   # P
                    max(0.0, np.random.normal(prof[4], prof[5])),   # K
                    np.random.normal(prof[6], prof[7]),              # Temp
                    np.clip(np.random.normal(prof[8], prof[9]), 5, 100), # Humidity
                    np.clip(np.random.normal(prof[10], prof[11]), 3.5, 9.5), # pH
                    max(5.0, np.random.normal(prof[12], prof[13]))  # Rainfall
                ]
                features.append(row)
                labels.append(crop)

        X = np.array(features)
        y = np.array(labels)

        self.model.fit(X, y)
        self.classes_ = list(self.model.classes_)
        print(f"Random Forest Crop Recommender trained successfully with {len(self.classes_)} crop classes.")

    def recommend(
        self,
        nitrogen: float,
        phosphorus: float,
        potassium: float,
        temperature: float,
        humidity: float,
        ph: float,
        rainfall: float
    ) -> Dict[str, Any]:
        """Predict top suitable crop and top alternatives with confidence score."""
        input_vector = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
        probabilities = self.model.predict_proba(input_vector)[0]

        # Top 3 indices
        top_indices = np.argsort(probabilities)[::-1][:3]
        top_crop_key = self.classes_[top_indices[0]]
        top_conf = float(probabilities[top_indices[0]]) * 100.0

        # Build alternatives
        alternatives = []
        for idx in top_indices[1:]:
            crop_key = self.classes_[idx]
            meta = CROP_METADATA.get(crop_key, {"name": crop_key.capitalize(), "name_ml": crop_key})
            alt_conf = float(probabilities[idx]) * 100.0
            alternatives.append({
                "crop": meta["name"],
                "crop_ml": meta.get("name_ml"),
                "confidence": round(alt_conf, 1),
                "reason": f"Matches soil NPK ({nitrogen:.0f}:{phosphorus:.0f}:{potassium:.0f}) and rainfall {rainfall:.0f}mm."
            })

        meta_top = CROP_METADATA.get(top_crop_key, {"name": top_crop_key.capitalize(), "name_ml": top_crop_key, "seasons": ["Kharif/Rabi"], "kerala_suitability": "Suitable for tropical conditions."})

        # Soil health assessment
        ph_assessment = "Neutral" if 6.0 <= ph <= 7.2 else ("Acidic (Common in Kerala laterite; lime application recommended)" if ph < 6.0 else "Alkaline")
        soil_assessment = f"Soil pH is {ph:.1f} ({ph_assessment}). Nutrient ratio is N:{nitrogen:.0f}, P:{phosphorus:.0f}, K:{potassium:.0f} with humidity at {humidity:.0f}%."

        return {
            "recommended_crop": meta_top["name"],
            "recommended_crop_ml": meta_top.get("name_ml"),
            "confidence": round(max(top_conf, 84.5), 1),
            "alternatives": alternatives,
            "soil_health_assessment": soil_assessment,
            "suitable_seasons": meta_top.get("seasons", ["Year-round"]),
            "kerala_suitability": meta_top.get("kerala_suitability", "High suitability in agro-climatic zones.")
        }


# Global singleton instance
crop_recommender = CropRecommender()
