# ms_noticias/app/routes.py
from fastapi import APIRouter
from .controllers import obtener_noticias

router = APIRouter()

@router.get("/lista")
async def lista_noticias():
    return obtener_noticias()
