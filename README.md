# 🌾 AI-Powered Personal Farming Assistant (കിസാൻ AI കാർഷിക സഹായി)

> **A Production-Grade, Bilingual (English & Malayalam) AI Agricultural Decision-Support System tailored for Indian & Kerala Agriculture.**
> Built as a Capstone Engineering Project for B.Tech in Artificial Intelligence & Data Science.

---

## 🌟 Key Features

1. **🌿 Leaf Disease Scanner (Computer Vision)**:
   - PyTorch-based Deep Convolutional Neural Network (CNN) classifying 38+ plant conditions.
   - Outputs confidence score, visible symptoms, organic bio-remedies (Pseudomonas, Bordeaux mixture, Neem oil), approved chemical advisories, and cultural prevention tips.
   - Built-in confidence safety thresholding ($<65\%$ triggers advisory warning).

2. **🤖 Bilingual AI Farming Assistant (Multilingual RAG)**:
   - Voice (Speech-to-Text & Text-to-Speech) and Text input in **Malayalam (മലയാളം)** and **English**.
   - Retrieves verified agricultural practices from Kerala Agricultural University (KAU) & ICAR knowledge bases.
   - Strict safety guardrails against synthetic chemical dosage hallucination.

3. **📊 Soil-to-Crop Suitability Wizard (Machine Learning)**:
   - Multi-class **Random Forest Classifier** predicting highest-yielding crops based on Soil N, P, K, pH, Temperature, Humidity, and Rainfall.
   - Pre-calibrated presets for Kerala agro-ecological zones (Palakkad plains, Wayanad/Idukki high ranges, Kuttanad wetlands).

4. **🧪 Fertilizer & Soil Nutrition Calculator**:
   - Compares soil NPK reserves with target nutrient curves across growth stages (Basal, Vegetative, Flowering, Fruiting).
   - Prescribes organic composting recipes (FYM, Neem cake, Jeevamrutham, Fish amino acid) and balanced mineral formulations.
   - Automated Acidic Soil Conditioning alerts for agricultural lime (കുമ്മായം) and dolomite (ഡോളമൈറ്റ്).

5. **💧 Smart Irrigation Scheduler**:
   - Evapotranspiration & soil water retention logic across 5 soil types (Laterite, Sandy, Clay, Loamy, Alluvial).
   - Weather-aware: Automatically suppresses irrigation when heavy rainfall is forecast.

6. **🌦️ Hyperlocal Weather & Monsoon Alerts**:
   - Integrated with Open-Meteo live meteorological API.
   - Generates actionable agronomic advisories (pest outbreak warnings, spraying windows, drainage management).

7. **🔐 Security & Farmer Profile**:
   - JWT stateless authentication, bcrypt password hashing, input validation, and historical records.

---

## 🏛️ System Architecture

```
Frontend (React.js + Vite + Web Speech API)
  │
  ├── [HTTPS / Multipart / JSON]
  ▼
FastAPI Backend Gateway (Python 3.10+)
  │
  ├── JWT Auth & Security Middleware
  ├── PyTorch CNN Disease Inference Pipeline
  ├── Agronomy RAG Conversational Engine (FAISS + KAU Knowledge Base)
  ├── Random Forest Crop Suitability Classifier
  ├── Fertilizer & Evapotranspiration Irrigation Engine
  └── Hyperlocal Weather Advisory Service (Open-Meteo)
  │
  ├── [SQLAlchemy 2.0 ORM]
  ▼
PostgreSQL Database (Users, Diagnoses, Chats, Recommendations, Weather Logs)
```

---

## 🚀 Quick Start Guide (Windows / Linux)

### Prerequisites
* Python 3.10 or higher
* Node.js 18 or higher
* PostgreSQL (Optional — SQLite is pre-configured for instant zero-config local execution)

---

### Method A: Automated One-Click Launch (Windows)

1. Double-click `run_backend.bat` to launch the FastAPI server at `http://127.0.0.1:8000`.
2. Double-click `run_frontend.bat` to launch the React UI at `http://localhost:5173`.

---

### Method B: Manual Step-by-Step Installation

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
# Windows:
python -m venv venv
venv\Scripts\activate
# Linux/macOS:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive API Documentation (Swagger): `http://127.0.0.1:8000/docs`
* Alternative Redoc Documentation: `http://127.0.0.1:8000/redoc`

#### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
* Open your browser at: `http://localhost:5173`

---

## 🧠 Machine Learning Training & Evaluation

The dedicated `ml/` directory contains standalone training and evaluation scripts:

```bash
# 1. Train the PyTorch CNN Disease Classifier
cd ml
python train_disease_model.py --epochs 10 --batch-size 32 --lr 0.001

# 2. Evaluate Disease Classifier (Calculates Accuracy, Precision, Recall, F1, and Confusion Matrix)
python evaluate_disease_model.py

# 3. Train the Random Forest Crop Suitability Model
python train_crop_model.py
```

---

## 🧪 Running Automated Unit Tests

```bash
cd backend
pytest -v
```

---

## 🐳 Docker Deployment

```bash
# Launch PostgreSQL, FastAPI Backend, and React Frontend in isolated containers
docker-compose up --build
```
* Web App: `http://localhost:3000`
* Backend API: `http://localhost:8000`

---

## 📡 Sample API Requests & Responses

### 1. Disease Prediction
`POST /api/disease/predict`
```bash
curl -X POST "http://127.0.0.1:8000/api/disease/predict" \
     -H "accept: application/json" \
     -F "file=@test_leaf.jpg"
```
**Sample Response:**
```json
{
  "crop": "Tomato",
  "crop_ml": "തക്കാളി",
  "disease": "Early Blight",
  "disease_ml": "ഏർളി ബ്ലൈറ്റ് (ഇല കരിച്ചിൽ)",
  "confidence": 94.2,
  "is_confident": true,
  "symptoms": [
    "Dark brown to black spots with concentric rings on older leaves."
  ],
  "recommendations": {
    "organic": [
      "Spray 1% Bordeaux mixture or 20g Pseudomonas fluorescens per liter of water."
    ],
    "chemical_advisory": "For severe field infections, consult local Krishi Bhavan for approved Mancozeb (2g/L) schedule."
  }
}
```

### 2. Multilingual Farming Chatbot
`POST /api/chat`
```json
{
  "message": "വാഴയിലെ പിണ്ടിപ്പുഴുവിനെ എങ്ങനെ നിയന്ത്രിക്കാം?",
  "language": "auto"
}
```
**Sample Response:**
```json
{
  "answer": "വാഴയെ ബാധിക്കുന്ന പ്രധാന കീടമാണ് പിണ്ടിപ്പുഴു...\n1. ജൈവ നിയന്ത്രണം: ബ്യൂവേറിയ ബാസിയാന (20 ഗ്രാം/ലിറ്റർ) തളിക്കുക.",
  "language": "ml",
  "sources": [
    {
      "title": "Banana Pseudostem Weevil Management",
      "category": "Pest Management - Horticulture"
    }
  ]
}
```

---

## 🎓 B.Tech Project Viva Questions & Answers

### Q1: What is the core problem this project solves?
**Answer**: Smallholder and rural farmers in India/Kerala often lack immediate access to agricultural extension officers when leaf diseases or pest attacks emerge. This system provides instant, accessible, multilingual (Malayalam & English) AI decision-support for leaf pathology, soil nutrient balancing, weather-adaptive irrigation, and crop selection.

### Q2: Why did you choose a Convolutional Neural Network (CNN) for leaf disease diagnosis?
**Answer**: CNNs possess translation invariance and hierarchical spatial feature extraction capabilities. They automatically extract low-level edges, textures, and high-level lesion patterns without manual feature engineering.

### Q3: How do you handle cases where the AI is uncertain about a disease?
**Answer**: We implement a confidence threshold mechanism ($\tau = 0.55\text{--}0.65$). If the top Softmax probability falls below $\tau$, the system explicitly returns a warning stating low confidence and advises physical verification at a Krishi Bhavan rather than making a false positive diagnosis.

### Q4: Why is Random Forest suitable for Crop Recommendation?
**Answer**: Random Forest is an ensemble of decision trees that handles non-linear boundaries among multi-dimensional agronomic features (N, P, K, pH, rainfall, temperature) without being prone to overfitting, and provides calibrated class probabilities.

### Q5: How is multilingual Malayalam text processed?
**Answer**: The system uses a dedicated translation and regex Unicode layer identifying Malayalam script (`\u0D00-\u0D7F`), matching queries against bilingual agronomic knowledge bases, and rendering responses with Web Speech API STT and TTS.
