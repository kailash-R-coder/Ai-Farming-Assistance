import io
from PIL import Image


def test_disease_predict(client):
    # Create synthetic test image in memory
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_byte_arr.seek(0)

    files = {
        "file": ("test_leaf.jpg", img_byte_arr, "image/jpeg")
    }

    response = client.post("/api/disease/predict", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "crop" in data
    assert "disease" in data
    assert "confidence" in data
    assert "recommendations" in data
    assert "organic" in data["recommendations"]
    assert "chemical_advisory" in data["recommendations"]
