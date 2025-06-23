# Uncomment the imports below before you add the function code
import requests
import os
import json
from dotenv import load_dotenv
from django.conf import settings

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(url, **kwargs):
    print(f"Making request to: {backend_url}{url}")  # Add this line
    try:
        response = requests.get(f"{backend_url}{url}", headers={'Content-Type': 'application/json'}, params=kwargs)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Request failed: {str(e)}")
        return None

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")



def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")
        return None