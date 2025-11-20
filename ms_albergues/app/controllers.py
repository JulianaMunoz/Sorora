from pymongo import MongoClient
from bson import ObjectId
from fastapi import HTTPException
import os

client = MongoClient(os.getenv("MONGODB_URL", "mongodb://sorora-mongodb:27017/"))
db = client[os.getenv("MONGODB_DB", "sorora")]
collection = db["albergues"]

def listar_albergues():
    return list(collection.find({}, {"_id": 0}))

def crear_albergue(data):
    collection.insert_one(data.dict())
    return {"msg": "Albergue creado con éxito"}


def inicializar_albergues():
    """
    Inserta albergues de ejemplo si la colección está vacía.
    """
    if collection.count_documents({}) == 0:
        datos_iniciales = [
            {
                "name": "Albergue Bogotá Centro",
                "address": "Cra. 7 #12-34, Bogotá",
                "latitude": 4.60971,
                "longitude": -74.08175,
                "capacity": 120,
                "phone": "+57 3101234567"
            },
            {
                "name": "Refugio Norte",
                "address": "Calle 127 #45-67, Bogotá",
                "latitude": 4.728,
                "longitude": -74.046,
                "capacity": 80,
                "phone": "+57 3159876543"
            },
            {
                "name": "Casa de Paso Sur",
                "address": "Av. Caracas #50-10 Sur, Bogotá",
                "latitude": 4.579,
                "longitude": -74.118,
                "capacity": 60,
                "phone": "+57 3205551122"
            },
            {
                "name": "Centro Comunitario Teusaquillo",
                "address": "Calle 34 #15-45, Bogotá",
                "latitude": 4.637,
                "longitude": -74.081,
                "capacity": 90,
                "phone": "+57 3106549871"
            },
            {
                "name": "Albergue Engativá Solidario",
                "address": "Cra 78 #64-12, Bogotá",
                "latitude": 4.689,
                "longitude": -74.103,
                "capacity": 70,
                "phone": "+57 3007894561"
            },
            {
                "name": "Refugio Kennedy Esperanza",
                "address": "Calle 38 Sur #78-23, Bogotá",
                "latitude": 4.617,
                "longitude": -74.157,
                "capacity": 110,
                "phone": "+57 3112233445"
            },
            {
                "name": "Casa Refugio Suba",
                "address": "Av. Suba #110-45, Bogotá",
                "latitude": 4.742,
                "longitude": -74.083,
                "capacity": 95,
                "phone": "+57 3167788990"
            },
            {
                "name": "Albergue Usaquén Norte",
                "address": "Cra. 9 #152-23, Bogotá",
                "latitude": 4.763,
                "longitude": -74.034,
                "capacity": 85,
                "phone": "+57 3123456789"
            },
            {
                "name": "Centro de Ayuda Bosa",
                "address": "Calle 57 Sur #80-10, Bogotá",
                "latitude": 4.61,
                "longitude": -74.19,
                "capacity": 75,
                "phone": "+57 3135566778"
            },
            {
                "name": "Refugio San Cristóbal",
                "address": "Carrera 5 Este #16A-50 Sur, Bogotá",
                "latitude": 4.57,
                "longitude": -74.09,
                "capacity": 65,
                "phone": "+57 3019988776"
            }
        ]
        collection.insert_many(datos_iniciales)
        print("✅ Albergues iniciales insertados automáticamente.")
    else:
        print("ℹ️ Ya existen albergues en la base, no se insertaron duplicados.")
