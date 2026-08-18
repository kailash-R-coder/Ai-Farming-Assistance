def test_weather_endpoint(client):
    response = client.get("/api/weather?latitude=10.8505&longitude=76.2711&location=Kerala")
    assert response.status_code == 200
    data = response.json()
    assert "current_temperature" in data
    assert "humidity" in data
    assert "agricultural_advisories" in data
    assert len(data["agricultural_advisories"]) > 0
    assert len(data["forecast_daily"]) > 0
