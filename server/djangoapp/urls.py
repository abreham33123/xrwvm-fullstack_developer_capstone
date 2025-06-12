from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Authentication paths
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_request, name='logout'),
    path('register/', views.registration, name='register'),
    
    # Car data path
    path('get_cars/', views.get_cars, name='get_cars'),
    
    # Remove this circular reference:
    # path('', include('djangoapp.urls')),
    
    # Add other paths for your application here
    # path('dealers/', views.get_dealerships, name='dealers'),
    # path('reviews/', views.get_dealer_reviews, name='reviews'),
    # path('add_review/', views.add_review, name='add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)