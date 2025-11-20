# ms_reportes/app/routes.py
from fastapi import APIRouter
from .models import Reporte
from .controllers import crear_reporte, listar_reportes, obtener_metricas

router = APIRouter()

@router.post("/registrar")
async def registrar_reporte(reporte: Reporte):
    return crear_reporte(reporte)

@router.get("/listar")
async def obtener_reportes():
    return listar_reportes()

@router.get("/metricas")
async def metricas_reportes():
    return obtener_metricas()
