
Alzheimer's Disease Stage Classification (FYP)

An end-to-end Deep Learning system designed to classify dementia stages from MRI scans. This project encompasses the full machine learning lifecycle: from comparative model training to full-stack deployment.

## 🚀 Project Components
* **Deep Learning Engine:** Built with TensorFlow 2.18, evaluating multiple architectures including Custom CNNs and Transfer Learning.
* **Backend API:** Python-based server handling image preprocessing and model inference.
* **Frontend UI:** React.js dashboard for seamless MRI image upload and diagnostic display.

## 🏗️ Repository Structure
```text
alzheimers-fyp/
├── alzheimers-backend/          # Python Backend (Flask/FastAPI)
│   ├── main.py                  # API Entry Point
│   ├── mobilenet_inference.keras   # Optimized Production Model
│   ├── labels.json              # Class Name Mapping
│   └── requirements.txt         # Dependency List
└── alzheimers-frontend/         # React Frontend
    ├── src/                     # React Logic (App.jsx, Components)
    ├── public/                  # Static Assets
    └── package.json             # NPM Configuration
