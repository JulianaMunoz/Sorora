from fastapi import APIRouter
from .controllers import enviar_telegram
from .models import Notificacion

router = APIRouter()

@router.post("/enviar")
async def enviar_notificacion(notificacion: Notificacion):
    return enviar_telegram(notificacion)
