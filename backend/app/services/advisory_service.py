from typing import Dict, Any, List


# Standard optimal NPK requirements (kg/ha or relative index)
CROP_OPTIMAL_NPK = {
    "rice / paddy": {"N": (70, 90), "P": (35, 50), "K": (35, 50), "ph": (5.5, 6.8), "name_ml": "നെല്ല്"},
    "banana": {"N": (150, 200), "P": (50, 70), "K": (200, 300), "ph": (6.0, 7.5), "name_ml": "വാഴ"},
    "coconut": {"N": (400, 600), "P": (250, 350), "K": (900, 1200), "ph": (5.2, 7.0), "name_ml": "തെങ്ങ്"}, # grams/palm/year
    "tomato": {"N": (75, 100), "P": (50, 70), "K": (50, 75), "ph": (6.0, 7.0), "name_ml": "തക്കാളി"},
    "pepper": {"N": (50, 70), "P": (40, 55), "K": (100, 150), "ph": (5.5, 6.5), "name_ml": "കുരുമുളക്"},
    "vegetables": {"N": (60, 90), "P": (40, 60), "K": (40, 60), "ph": (6.0, 7.0), "name_ml": "പച്ചക്കറികൾ"},
    "tapioca": {"N": (50, 75), "P": (40, 50), "K": (75, 100), "ph": (5.0, 6.5), "name_ml": "കപ്പ / മരച്ചീനി"}
}

# Soil water retention coefficients
SOIL_WATER_RETENTION = {
    "sandy": {"retention": "Low", "frequency_days": 1, "drainage": "Very Fast", "advice": "Sandy soil dries rapidly; use drip irrigation and organic mulching to prevent drying."},
    "laterite": {"retention": "Moderate", "frequency_days": 2, "drainage": "Good", "advice": "Typical Kerala laterite soil. Add farmyard manure to enhance water and nutrient holding capacity."},
    "loamy": {"retention": "High", "frequency_days": 3, "drainage": "Balanced", "advice": "Ideal soil structure. Retains balanced moisture without waterlogging."},
    "clay": {"retention": "Very High", "frequency_days": 4, "drainage": "Slow", "advice": "High water-holding capacity. Avoid over-irrigation to prevent root asphyxiation."},
    "alluvial": {"retention": "High", "frequency_days": 3, "drainage": "Good", "advice": "Rich in organic nutrients. Irrigate moderately based on canopy size."}
}


class AdvisoryService:
    """Computes agronomic fertilizer balance and soil-aware irrigation scheduling."""

    @staticmethod
    def calculate_fertilizer(
        crop: str,
        soil_n: float,
        soil_p: float,
        soil_k: float,
        soil_ph: float = 6.5,
        growth_stage: str = "Vegetative"
    ) -> Dict[str, Any]:
        crop_lower = crop.lower().strip()
        matched_profile = None
        for k, v in CROP_OPTIMAL_NPK.items():
            if k in crop_lower or crop_lower in k:
                matched_profile = v
                break

        if not matched_profile:
            matched_profile = CROP_OPTIMAL_NPK["vegetables"]

        # Evaluate nutrient status
        def eval_status(val, min_v, max_v):
            if val < min_v:
                return "Deficient (Low)"
            elif val > max_v * 1.3:
                return "Excess (High)"
            return "Optimal (Adequate)"

        status_n = eval_status(soil_n, matched_profile["N"][0], matched_profile["N"][1])
        status_p = eval_status(soil_p, matched_profile["P"][0], matched_profile["P"][1])
        status_k = eval_status(soil_k, matched_profile["K"][0], matched_profile["K"][1])

        organic_recs = [
            {
                "name": "Well-decomposed Farmyard Manure (FYM / ചാണകം)",
                "dosage": "5 to 10 kg per plant / 10 tonnes/ha",
                "timing": "Basal application during land preparation or pre-monsoon."
            },
            {
                "name": "Neem Cake (വേപ്പിൻ പിണ്ണാക്ക്)",
                "dosage": "250g - 500g per plant base",
                "timing": "Mix with soil around roots to supply organic N and repel nematodes."
            },
            {
                "name": "Vermicompost (മണ്ണിരവളം) + Jeevamrutham",
                "dosage": "2 kg per plant / 500 ml Jeevamrutham slurry every 15 days",
                "timing": "During active vegetative and flowering flush."
            }
        ]

        mineral_recs = []
        if "Deficient" in status_n:
            mineral_recs.append({
                "name": "Urea (46% N) / Factamfos (20:20:0:13)",
                "dosage": "Split into 2-3 equal doses",
                "timing": "Vegetative tillering / active growth stage. Avoid applying before heavy rains."
            })
        if "Deficient" in status_p:
            mineral_recs.append({
                "name": "Rock Phosphate (Rajphos) / Bone Meal (എല്ലുപൊടി)",
                "dosage": "Basal dose incorporated into root zone",
                "timing": "At planting / post-monsoon trench opening."
            })
        if "Deficient" in status_k:
            mineral_recs.append({
                "name": "Muriate of Potash (MOP - 60% K2O) / Wood Ash (ചാരം)",
                "dosage": "Apply in 2 split doses",
                "timing": "Crucial during bunch/fruit formation and grain filling."
            })

        if not mineral_recs:
            mineral_recs.append({
                "name": "Balanced NPK Maintenance Formulation",
                "dosage": "Minimal maintenance dose only",
                "timing": "Soil reserves are sufficient. Do not over-apply."
            })

        # Soil acidity conditioning (Kerala soils are predominantly acidic laterite)
        soil_conditioning = None
        if soil_ph < 6.0:
            soil_conditioning = (
                f"Soil pH is {soil_ph:.1f} (Acidic). Apply Agricultural Lime (കുമ്മായം) or Dolomite (ഡോളമൈറ്റ്) "
                f"at 250-500 kg/hectare (or 250g per banana/coconut pit) 2 weeks before applying chemical fertilizers."
            )

        warnings = [
            "Never apply chemical fertilizers directly in contact with the plant stem.",
            "Always apply fertilizers when the soil has adequate moisture; do not apply in dry soil or right before torrential rainfall.",
            "Consult your nearest Krishi Bhavan for exact soil-test-based fertilizer dosage card."
        ]

        return {
            "crop": crop,
            "crop_ml": matched_profile.get("name_ml"),
            "nutrient_status": {
                "Nitrogen (N)": status_n,
                "Phosphorus (P)": status_p,
                "Potassium (K)": status_k
            },
            "organic_recommendations": organic_recs,
            "mineral_recommendations": mineral_recs,
            "soil_conditioning": soil_conditioning,
            "application_guidelines": f"For {crop} at {growth_stage} stage: Incorporate organic manures thoroughly in top 15cm soil. Apply mineral fertilizers in a shallow ring 30-50cm away from the trunk.",
            "warnings": warnings
        }

    @staticmethod
    def calculate_irrigation(
        crop: str,
        soil_type: str,
        temperature: float,
        humidity: float,
        rainfall_forecast_mm: float = 0.0,
        recent_irrigation_days_ago: int = 2
    ) -> Dict[str, Any]:
        soil_lower = soil_type.lower().strip()
        soil_info = SOIL_WATER_RETENTION.get(soil_lower, SOIL_WATER_RETENTION["laterite"])

        # Determine if irrigation is needed
        irrigation_needed = True
        status_text = "Irrigation Required Today"
        status_text_ml = "ഇന്ന് നനയ്ക്കേണ്ടതുണ്ട്"
        reason = ""
        reason_ml = ""

        if rainfall_forecast_mm >= 15.0:
            irrigation_needed = False
            status_text = "No Irrigation Needed (Heavy Rain Forecast)"
            status_text_ml = "നനയ്ക്കേണ്ടതില്ല (കനത്ത മഴ മുന്നറിയിപ്പ്)"
            reason = f"Upcoming rainfall of {rainfall_forecast_mm:.1f}mm is expected to meet soil moisture requirements."
            reason_ml = f"{rainfall_forecast_mm:.1f} മി.മീ മഴ പ്രതീക്ഷിക്കുന്നതിനാൽ ഇന്ന് നന ഒഴിവാക്കാം."
        elif recent_irrigation_days_ago < soil_info["frequency_days"] and rainfall_forecast_mm > 2.0:
            irrigation_needed = False
            status_text = "Adequate Moisture Present"
            status_text_ml = "മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട്"
            reason = f"Soil moisture is adequate following recent watering ({recent_irrigation_days_ago} days ago) in {soil_type} soil."
            reason_ml = f"{recent_irrigation_days_ago} ദിവസം മുൻപ് നനച്ചതും ഈർപ്പവും ഉള്ളതിനാൽ ഇപ്പോൾ നന ആവശ്യമില്ല."
        else:
            reason = f"{soil_type} soil at {temperature:.1f}°C and {humidity:.1f}% humidity requires replenishment after {recent_irrigation_days_ago} days."
            reason_ml = f"{temperature:.1f}°C ചൂടും {humidity:.1f}% ഈർപ്പവും ഉള്ളതിനാൽ {recent_irrigation_days_ago} ദിവസത്തിന് ശേഷം നന നൽകണം."

        # Water volume estimate
        crop_lower = crop.lower()
        if "banana" in crop_lower:
            water_depth = "40 - 50 Liters per plant"
        elif "coconut" in crop_lower:
            water_depth = "40 - 60 Liters per palm (or drip at 30L/day)"
        elif "paddy" in crop_lower or "rice" in crop_lower:
            water_depth = "Maintain 2-3 cm standing water layer"
        else:
            water_depth = "15 - 25 Liters per square meter"

        recommended_timing = "Early Morning (6:00 AM - 8:30 AM) or Late Evening (5:00 PM - 6:30 PM)"

        tips = [
            "Avoid irrigating during peak noon heat (11:30 AM - 3:30 PM) to prevent thermal shock and high evaporation.",
            "Apply dry organic mulch (straw/dry leaves) around the root zone to conserve up to 40% soil moisture.",
            "Use drip or micro-sprinkler systems to deliver water directly to the active feeder root zone."
        ]

        return {
            "irrigation_required": irrigation_needed,
            "status_text": status_text,
            "status_text_ml": status_text_ml,
            "recommended_timing": recommended_timing,
            "estimated_water_liters_per_plant_or_sqm": water_depth,
            "reason": reason,
            "reason_ml": reason_ml,
            "rain_impact": f"Forecast precipitation: {rainfall_forecast_mm:.1f} mm.",
            "best_practice_tips": tips
        }
