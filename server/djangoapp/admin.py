from django.contrib import admin
from .models import CarMake, CarModel

# CarModelInline class
class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 2  # Number of empty forms to display
    fields = ['name', 'type', 'year', 'engine', 'horsepower', 'mpg', 'price']  # Fields to show in inline

# CarModelAdmin class
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year', 'price')  # Columns in list view
    list_filter = ['car_make', 'type', 'year']  # Filters on the right
    search_fields = ['name', 'car_make__name']  # Searchable fields
    ordering = ['-year', 'name']  # Default ordering

# CarMakeAdmin class with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]  # Show CarModels inline when editing CarMake
    list_display = ('name', 'founded_date', 'headquarters')  # Columns in list view
    search_fields = ['name', 'headquarters']  # Searchable fields
    list_filter = ['founded_date']  # Filters on the right

# Register models here
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)