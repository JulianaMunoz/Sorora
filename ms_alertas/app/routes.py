from fastapi import APIRouter, BackgroundTasks
from .models import Alert
from .controllers import crear_alerta

router = APIRouter()

@router.post("/")
async def crear(alerta: Alert, background_tasks: BackgroundTasks):
    # crear_alerta devuelve una función que envía la notificación
    return crear_alerta(alerta, background_tasks)


@router.get("/")
async def obtener_alertas():
    return listar_alertas() 