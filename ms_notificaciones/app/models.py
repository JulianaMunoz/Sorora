from pydantic import BaseModel

class Notificacion(BaseModel):
    asunto: str
    mensaje: str
