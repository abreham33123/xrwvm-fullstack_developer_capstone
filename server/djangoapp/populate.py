from .models import CarMake, CarModel

def initiate():
    # Create car makes
    makes = [
        {"name":"NISSAN", "description":"Great cars. Japanese technology"},
        {"name":"Mercedes", "description":"Great cars. German technology"},
        {"name":"Audi", "description":"Great cars. German technology"},
        {"name":"Kia", "description":"Great cars. Korean technology"},
        {"name":"Toyota", "description":"Great cars. Japanese technology"},
    ]
    
    make_instances = []
    for make in makes:
        make_instances.append(CarMake.objects.create(**make))
    
    # Create car models
    models = [
        {"name":"Pathfinder", "type":"SUV", "year": 2023, "car_make":make_instances[0]},
        {"name":"Qashqai", "type":"SUV", "year": 2023, "car_make":make_instances[0]},
        {"name":"XTRAIL", "type":"SUV", "year": 2023, "car_make":make_instances[0]},
        {"name":"A-Class", "type":"SUV", "year": 2023, "car_make":make_instances[1]},
        {"name":"C-Class", "type":"SUV", "year": 2023, "car_make":make_instances[1]},
        {"name":"E-Class", "type":"SUV", "year": 2023, "car_make":make_instances[1]},
        {"name":"A4", "type":"SUV", "year": 2023, "car_make":make_instances[2]},
        {"name":"A5", "type":"SUV", "year": 2023, "car_make":make_instances[2]},
        {"name":"A6", "type":"SUV", "year": 2023, "car_make":make_instances[2]},
        {"name":"Sorrento", "type":"SUV", "year": 2023, "car_make":make_instances[3]},
        {"name":"Carnival", "type":"SUV", "year": 2023, "car_make":make_instances[3]},
        {"name":"Cerato", "type":"Sedan", "year": 2023, "car_make":make_instances[3]},
        {"name":"Corolla", "type":"Sedan", "year": 2023, "car_make":make_instances[4]},
        {"name":"Camry", "type":"Sedan", "year": 2023, "car_make":make_instances[4]},
        {"name":"Kluger", "type":"SUV", "year": 2023, "car_make":make_instances[4]},
    ]
    
    for model in models:
        CarModel.objects.create(**model)