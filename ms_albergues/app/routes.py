from fastapi import APIRouter
from .models import Albergue
from .controllers import listar_albergues, crear_albergue

router = APIRouter()

@router.get("/")
async def obtener_albergues():
    return listar_albergues()

@router.post("/")
async def crear(albergue: Albergue):
    return crear_albergue(albergue)
