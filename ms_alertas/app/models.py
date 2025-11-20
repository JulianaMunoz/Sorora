from pydantic import BaseModel

class Alert(BaseModel):
    tipo: str
    descripcion: str
    nivel: str
    latitude: float
    longitude: float
