def test_crop_recommendation(client):
    payload = {
        "nitrogen": 90.0,
        "phosphorus": 42.0,
        "potassium": 43.0,
        "temperature": 25.5,
        "humidity": 80.0,
        "ph": 6.5,
        "rainfall": 200.0
    }
    response = client.post("/api/crop/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommended_crop" in data
    assert "confidence" in data
    assert "alternatives" in data
    assert len(data["alternatives"]) > 0


def test_fertilizer_recommendation(client):
    payload = {
        "crop": "Banana",
        "soil_n": 80.0,
        "soil_p": 25.0,
        "soil_k": 50.0,
        "soil_ph": 5.8,
        "growth_stage": "Vegetative"
    }
    response = client.post("/api/fertilizer/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crop"] == "Banana"
    assert "nutrient_status" in data
    assert "organic_recommendations" in data
    assert "mineral_recommendations" in data
    assert data["soil_conditioning"] is not None  # Checks acidic soil warning


def test_irrigation_recommendation(client):
    payload = {
        "crop": "Tomato",
        "soil_type": "Laterite",
        "temperature": 32.0,
        "humidity": 60.0,
        "rainfall_forecast_mm": 0.0,
        "recent_irrigation_days_ago": 3
    }
    response = client.post("/api/irrigation/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "irrigation_required" in data
    assert "recommended_timing" in data
    assert "estimated_water_liters_per_plant_or_sqm" in data
