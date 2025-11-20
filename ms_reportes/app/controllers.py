# ms_reportes/app/controllers.py
from fastapi import HTTPException
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

# Conexión a Mongo (ajusta tu URI si ya la tienes global)
client = MongoClient("mongodb://sorora-mongodb:27017")
db = client["sorora_db"]
reportes_collection = db["reportes"]

def crear_reporte(reporte):
    try:
        nuevo_reporte = dict(reporte)
        result = reportes_collection.insert_one(nuevo_reporte)
        return {"mensaje": "Reporte registrado correctamente", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar reporte: {str(e)}")


def listar_reportes():
    try:
        reportes = list(reportes_collection.find())
        for r in reportes:
            r["_id"] = str(r["_id"])
        return reportes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener reportes: {str(e)}")


def obtener_metricas():
    try:
        total = reportes_collection.count_documents({})
        por_tipo = list(reportes_collection.aggregate([
            {"$group": {"_id": "$tipo", "cantidad": {"$sum": 1}}},
            {"$sort": {"cantidad": -1}}
        ]))
        por_estado = list(reportes_collection.aggregate([
            {"$group": {"_id": "$estado", "cantidad": {"$sum": 1}}}
        ]))
        ultimos = list(reportes_collection.find().sort("fecha", -1).limit(5))

        for r in ultimos:
            r["_id"] = str(r["_id"])

        return {
            "total_reportes": total,
            "por_tipo": por_tipo,
            "por_estado": por_estado,
            "ultimos_reportes": ultimos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar métricas: {str(e)}")
