from fastapi import FastAPI,File,UploadFile
import pandas as pd
from io import StringIO
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
import numpy as np
import pickle

from database import SessionLocal, Prediction, create_tables

# -------------------------------------------------
# APP SETUP
# -------------------------------------------------

app = FastAPI(title="Churn Prediction API")

# Create DB tables (safe to call multiple times)
create_tables()

# CORS (Vite runs on 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://churn-prediction-system.vercel.app/"],  # change later to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# LOAD MODEL ARTIFACTS
# -------------------------------------------------

model = pickle.load(open("model.pkl", "rb"))
encoders = pickle.load(open("encoders.pkl", "rb"))
columns = pickle.load(open("columns.pkl", "rb"))

# -------------------------------------------------
# PREDICT ENDPOINT (SAVES TO DB)
# -------------------------------------------------

@app.post("/predict")
def predict_churn(data: dict):
    input_data = []

    for col in columns:
        if col not in data:
            return {"error": f"Missing field: {col}"}

        value = data[col]

        if col in encoders:
            le = encoders[col]
            if value not in le.classes_:
                return {
                    "error": f"Invalid value '{value}' for {col}",
                    "allowed": le.classes_.tolist()
                }
            value = le.transform([value])[0]

        input_data.append(value)

    X = np.array(input_data).reshape(1, -1)
    prob = float(model.predict_proba(X)[0][1])

    risk = "High" if prob >= 0.5 else "Low"

    # Save prediction to DB
    db = SessionLocal()
    record = Prediction(
        churn_probability=round(prob, 3),
        risk_level=risk
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    db.close()

    return {
        "churn_probability": round(prob, 3),
        "risk_level": risk
    }

# -------------------------------------------------
# HISTORY ENDPOINT (FOR LINE CHART)
# -------------------------------------------------

@app.get("/history")
def get_history(limit: int = 20):
    db = SessionLocal()
    records = (
        db.query(Prediction)
        .order_by(Prediction.created_at.asc())
        .limit(limit)
        .all()
    )
    db.close()

    return [
        {
            "id": r.id,
            "probability": r.churn_probability,
            "risk": r.risk_level,
            "timestamp": r.created_at
        }
        for r in records
    ]

# -------------------------------------------------
# RISK DISTRIBUTION ENDPOINT (FOR PIE CHART)
# -------------------------------------------------

@app.get("/risk-distribution")
def risk_distribution():
    db = SessionLocal()

    results = (
        db.query(
            Prediction.risk_level,
            func.count(Prediction.id)
        )
        .group_by(Prediction.risk_level)
        .all()
    )

    db.close()

    return [
        {
            "name": risk,   # "High" / "Low"
            "value": count
        }
        for risk, count in results
    ]
#--------------------------------------------------
# BATCH UPLOAD PREDICTION ENDPOINT
#--------------------------------------------------
@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")))

    # Validate columns
    missing_cols = [c for c in columns if c not in df.columns]
    if missing_cols:
        return {"error": f"Missing columns: {missing_cols}"}

    predictions = []
    db = SessionLocal()

    for _, row in df.iterrows():
        input_data = []

        for col in columns:
            value = row[col]

            if col in encoders:
                le = encoders[col]
                if value not in le.classes_:
                    return {"error": f"Invalid value '{value}' in column '{col}'"}
                value = le.transform([value])[0]

            input_data.append(value)

        X = np.array(input_data).reshape(1, -1)
        prob = float(model.predict_proba(X)[0][1])
        risk = "High" if prob >= 0.5 else "Low"

        record = Prediction(
            churn_probability=round(prob, 3),
            risk_level=risk,
            created_at=datetime.utcnow()
        )
        db.add(record)

        predictions.append(prob)

    db.commit()
    db.close()

    return {
        "rows_processed": len(predictions),
        "avg_churn_probability": round(sum(predictions) / len(predictions), 3),
        "high_risk": sum(p >= 0.5 for p in predictions),
        "low_risk": sum(p < 0.5 for p in predictions),
    }
