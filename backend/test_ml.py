import os
from dotenv import load_dotenv
load_dotenv(dotenv_path="c:\\Users\\ojasv\\OneDrive\\Desktop\\NLP\\backend\\.env")
import sys
sys.path.append("c:\\Users\\ojasv\\OneDrive\\Desktop\\NLP\\backend")
import ml_models

print(ml_models.predict_toxicity("i want to kill him"))
