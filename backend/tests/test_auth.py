def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_and_login(client):
    # 1. Register new farmer
    payload = {
        "name": "Kailas Farmer",
        "email": "kailas.farmer@example.com",
        "password": "StrongPassword123",
        "preferred_language": "ml",
        "location": "Palakkad, Kerala",
        "latitude": 10.7867,
        "longitude": 76.6548
    }
    reg_res = client.post("/api/auth/register", json=payload)
    assert reg_res.status_code == 201
    data = reg_res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "kailas.farmer@example.com"
    assert data["user"]["preferred_language"] == "ml"

    token = data["access_token"]

    # 2. Login
    login_res = client.post("/api/auth/login", json={
        "email": "kailas.farmer@example.com",
        "password": "StrongPassword123"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 3. Get profile with JWT
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Kailas Farmer"
