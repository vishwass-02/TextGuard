import requests

response = requests.post("http://localhost:8000/predict/toxicity", json={"text": "i want to kill him"})
print("Status:", response.status_code)
print("Response:", response.text)
