from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="Crop Disease Prediction API")

# Allow requests from your React Native app during development.
# Tighten this once you deploy (restrict to your actual app's origin/domain).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Dummy data: stands in for your trained model + database lookup ----
# Replace this with real model inference + DB query once ready.
DUMMY_DISEASES = [
    {
        "status": "confident",
        "disease": "Leaf Blight",
        "confidence": 0.87,
        "severity": "Moderate",
        "solution": "Remove affected leaves and apply a copper-based fungicide. Avoid overhead watering.",
        "prevention": "Avoid overhead watering; ensure proper spacing between plants for airflow.",
    },
    {
        "status": "confident",
        "disease": "Powdery Mildew",
        "confidence": 0.93,
        "severity": "Mild",
        "solution": "Spray with a sulfur-based fungicide or neem oil. Improve air circulation around plants.",
        "prevention": "Avoid overcrowding plants; water at the base rather than on leaves.",
    },
    {
        "status": "low_confidence",
        "disease": "Bacterial Spot",
        "confidence": 0.52,
        "matches": [
            {"disease": "Bacterial Spot", "confidence": 0.52},
            {"disease": "Leaf Blight", "confidence": 0.31},
        ],
    },
    {
        "status": "no_match",
    },
]


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Crop Disease Prediction API is running"}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # For now: ignore the actual image content and return a random dummy result,
    # just so the app has real request/response round trips to test against.
    contents = await image.read()  # confirms the upload actually arrives
    result = random.choice(DUMMY_DISEASES)
    return result
