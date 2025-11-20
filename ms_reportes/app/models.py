# ms_reportes/app/models.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Reporte(BaseModel):
    tipo: str = Field(..., description="Tipo de caso (Feminicidio, Acoso, Violencia doméstica, etc.)")
    descripcion: str = Field(..., description="Descripción detallada del caso")
    ubicacion: Optional[str] = Field(None, description="Lugar o municipio del incidente")
    fecha: datetime = Field(default_factory=datetime.utcnow, description="Fecha del reporte")
    estado: str = Field(default="pendiente", description="Estado del caso (pendiente, en proceso, resuelto)")
    reportado_por: Optional[str] = Field(None, description="ID o nombre del usuario que reporta")
