# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel
from .populate import initiate


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.
def get_cars(request):
    car_models = CarModel.objects.select_related('car_make').all()
    cars = [{
        "CarModel": cm.name,
        "CarMake": cm.car_make.name,
        "Type": cm.type,
        "Year": cm.year.year,
        "DealerId": cm.dealer_id
    } for cm in car_models]
    
    response = JsonResponse({"CarModels": cars})
    response['Content-Type'] = 'application/json'
    return response
    
# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    print(f"Incoming request method: {request.method}")  # Debug
    print(f"Request headers: {request.headers}")  # Debug
    print(f"Request body: {request.body}")  # Debug
    
    if request.method != 'POST':
        logger.error(f"Invalid method attempted: {request.method}")
        return JsonResponse({
            'error': 'Only POST method allowed',
            'received_method': request.method  # Echo back what was received
        }, status=405)
    
    try:
        data = json.loads(request.body)
        logger.info(f"Login attempt for user: {data.get('userName')}")
        
        username = data.get('userName', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return JsonResponse({'error': 'Missing credentials'}, status=400)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            logger.info(f"User {username} authenticated successfully")
            return JsonResponse({
                'userName': username,
                'status': 'Authenticated',
                'session_id': request.session.session_key  # Verify session
            })
            
        logger.warning(f"Failed authentication for user: {username}")
        return JsonResponse({
            'error': 'Invalid credentials',
            'status': 'Failed'
        }, status=401)
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return JsonResponse({
            'error': 'Invalid JSON',
            'body_received': str(request.body)  # Show what was received
        }, status=400)

# Create a `logout_request` view to handle sign out request
def logout_request(request):
    username = request.user.username if request.user.is_authenticated else ""

    logout(request)

    data = {"userName": username}
    return JsonResponse(data)
# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['userName']
            password = data['password']
            first_name = data['firstName']
            last_name = data['lastName']
            email = data['email']

            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({"error": "Already Registered"})

            # Create new user
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )

            # Log the user in
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({
                    "userName": username,
                    "status": "Registered and Authenticated"
                })
                
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
