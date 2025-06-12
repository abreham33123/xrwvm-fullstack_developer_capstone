# Uncomment the following imports before adding the Model code

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    founded_year = models.IntegerField(null=True, blank=True)
    headquarters = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.name

class CarModel(models.Model):
    # Car type choices
    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    TRUCK = 'Truck'
    VAN = 'Van'
    TYPE_CHOICES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (TRUCK, 'Truck'),
        (VAN, 'Van'),
    ]
    
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    dealer_id = models.IntegerField()  # Refers to dealer in Cloudant DB
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default=SEDAN
    )
    year = models.DateField()
    engine = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year.year})"