import os
import random
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()  # reads variables from a local .env file

app = FastAPI(title="Crop Disease Prediction API")

# Allow requests from your React Native app during development.
# Tighten this once you deploy (restrict to your actual app's origin/domain).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- MongoDB connection ----
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
diseases_collection = db[COLLECTION_NAME]

# ---- Stand-in for your trained model ----
# Once your model is ready, replace this with real inference that outputs one of these labels.
DISEASE_CLASSES = ["gumosis", "anthracnose", "leaf_miner", "red_dust", "healthy"]


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Crop Disease Prediction API is running"}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    # Confirms the upload actually arrives — not used for prediction yet.
    contents = await image.read()

    # TEMP: randomly pick a class to simulate the model's output.
    # Replace this line with your real model's prediction once it's ready.
    predicted_disease_id = random.choice(DISEASE_CLASSES)

    # Look up the matching document in MongoDB using the predicted label.
    result = await diseases_collection.find_one({"disease_id": predicted_disease_id})

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No database entry found for disease_id '{predicted_disease_id}'",
        )

    # MongoDB's _id (ObjectId) isn't JSON-serializable by default — convert to string.
    result["_id"] = str(result["_id"])
    return result