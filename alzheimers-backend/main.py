from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import json
from tensorflow.keras.models import load_model

# Load clean inference model
model = load_model("mobilenet_inference.keras")

# Load labels
with open("labels.json", "r") as f:
    labels = json.load(f)

# Image size used during training
IMG_SIZE = (224, 224)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB")
    image = image.resize(IMG_SIZE)

    img_array = np.array(image, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

@app.get("/")
async def root():
    return {"message": "Alzheimer prediction API is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        img_tensor = preprocess_image(image)

        predictions = model.predict(img_tensor, verbose=0)
        prediction_index = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions))

        return {
            "stage": labels[prediction_index],
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")