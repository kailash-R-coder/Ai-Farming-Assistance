def test_chat_english(client):
    response = client.post("/api/chat", json={
        "message": "My tomato leaves are turning yellow. What should I do?",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["language"] == "en"
    assert len(data["sources"]) > 0


def test_chat_malayalam(client):
    response = client.post("/api/chat", json={
        "message": "വാഴയിലെ പിണ്ടിപ്പുഴുവിനെ എങ്ങനെ നിയന്ത്രിക്കാം?",
        "language": "auto"
    })
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["language"] == "ml"
    assert len(data["sources"]) > 0
