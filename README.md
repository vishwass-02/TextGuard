# TextGuard

A Full-Stack Spam Email & Toxic Comment Classifier.

## Overview
TextGuard is a web application where users can paste text (an email or a comment) and get an instant classification (Spam/Not Spam or Toxic/Non-Toxic) along with a confidence score and highlighted key indicators.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Lucide React
- **Backend**: FastAPI (Python) + SQLite
- **Machine Learning**: Dummy models included for rapid scaffolding. Scikit-learn (TF-IDF + Logistic Regression/Naive Bayes) will be layered in.

## Project Structure
- `/frontend`: Vite React App
- `/backend`: FastAPI Application + SQLite database
- `/training`: (To be added) ML training scripts

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Unix
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install fastapi uvicorn scikit-learn pandas sqlalchemy pydantic
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /predict/spam` - Classify text as Spam or Not Spam.
- `POST /predict/toxicity` - Classify text as Toxic or Non-Toxic.
- `GET /history` - Get recent predictions.
