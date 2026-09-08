import os
import json
from google import genai
from pydantic import BaseModel, Field

class ToxicityHighlight(BaseModel):
    word: str
    weight: float

class ToxicityResponse(BaseModel):
    label: str = Field(description="'Toxic' or 'Non-Toxic'")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    highlights: list[ToxicityHighlight] = Field(description="List of toxic words and their weights")
    explanation: str = Field(description="A brief explanation of why this text is considered toxic or non-toxic")

class SpamHighlight(BaseModel):
    word: str
    weight: float

class SpamResponse(BaseModel):
    label: str = Field(description="'Spam' or 'Not Spam'")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")
    highlights: list[SpamHighlight] = Field(description="List of spam words and their weights")
    explanation: str = Field(description="A brief explanation of why this text is considered spam or not spam")

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        return None
    return genai.Client(api_key=api_key)

def predict_spam(text: str):
    client = get_client()
    if not client:
        return {"label": "Error: Missing API Key", "confidence": 0.0, "highlights": [], "explanation": ""}
    
    prompt = f"Analyze the following text and determine if it is spam. Text: '{text}'"
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': SpamResponse,
            },
        )
        text = response.text
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {"label": "Error analyzing", "confidence": 0.0, "highlights": [], "explanation": ""}

def predict_toxicity(text: str):
    client = get_client()
    if not client:
        return {"label": "Error: Missing API Key", "confidence": 0.0, "highlights": [], "explanation": ""}
        
    prompt = f"Analyze the following text and determine if it is toxic. Text: '{text}'"
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': ToxicityResponse,
            },
        )
        text = response.text
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return {"label": "Error analyzing", "confidence": 0.0, "highlights": [], "explanation": ""}
