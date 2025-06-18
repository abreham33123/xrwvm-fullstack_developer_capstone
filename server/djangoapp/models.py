# Uncomment the following imports before adding the Model code
from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

# <HINT> Create a Car Make model `class CarMake(models.Model)`:
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    founded_date = models.DateField(null=True, blank=True)
    headquarters = models.CharField(max_length=100, blank=True)
    website_url = models.URLField(blank=True)

    def __str__(self):
        return self.name


# <HINT> Create a Car Model model `class CarModel(models.Model):`:
class CarModel(models.Model):
    # Many-To-One relationship to Car Make model
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    
    # Basic fields
    name = models.CharField(max_length=100)
    
    # Type choices
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('TRUCK', 'Truck'),
        ('VAN', 'Van'),
        ('SPORTS', 'Sports Car'),
    ]
    type = models.CharField(
        max_length=10,
        choices=CAR_TYPES,
        default='SUV'
    )
    
    # Year with validation
    year = models.IntegerField(
        default=2023,
        validators=[
            MinValueValidator(2015),
            MaxValueValidator(2023)
        ]
    )
    
    # Additional fields
    engine = models.CharField(max_length=50, blank=True)
    horsepower = models.IntegerField(null=True, blank=True)
    mpg = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_date = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
