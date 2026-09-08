from dotenv import load_dotenv
import os
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, SessionLocal, init_db, PredictionModel
from schemas import PredictionRequest, PredictionResponse, HistoryItem
import ml_models

app = FastAPI(title="TextGuard API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to TextGuard API. Visit /docs for documentation."}

@app.post("/predict/spam", response_model=PredictionResponse)
def predict_spam(request: PredictionRequest, db: Session = Depends(get_db)):
    result = ml_models.predict_spam(request.text)
    
    # Save to history
    db_item = PredictionModel(
        text=request.text,
        type="spam",
        result=result["label"],
        confidence=result["confidence"]
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return result

@app.post("/predict/toxicity", response_model=PredictionResponse)
def predict_toxicity(request: PredictionRequest, db: Session = Depends(get_db)):
    result = ml_models.predict_toxicity(request.text)
    
    # Save to history
    db_item = PredictionModel(
        text=request.text,
        type="toxicity",
        result=result["label"],
        confidence=result["confidence"]
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    return result

@app.get("/history", response_model=List[HistoryItem])
def get_history(limit: int = 10, db: Session = Depends(get_db)):
    items = db.query(PredictionModel).order_by(PredictionModel.timestamp.desc()).limit(limit).all()
    return items
