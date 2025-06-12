from django.contrib import admin
from .models import CarMake, CarModel  # Fixed import statement

class CarModelInline(admin.StackedInline):  # Fixed class name and capitalization
    model = CarModel
    extra = 1  # Number of empty forms to display

class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]  # Fixed variable name (lowercase 'l')
    list_display = ('name', 'founded_year', 'headquarters')  
    search_fields = ['name']

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')  
    list_filter = ('car_make', 'type', 'year')  
    search_fields = ['name', 'car_make__name']  

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)