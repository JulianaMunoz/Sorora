from pydantic import BaseModel, EmailStr
from typing import Optional

class Usuario(BaseModel):
    id: Optional[str] = None
    nombre: str
    correo: EmailStr
    contrasena: str
    rol: str = "usuario"

class PerfilUpdate(BaseModel):
    nombre: Optional[str]
    contrasena: Optional[str]

class Login(BaseModel):
    correo: EmailStr
    contrasena: str
