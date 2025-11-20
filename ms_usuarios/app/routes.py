from fastapi import APIRouter, Body
from .models import Usuario, PerfilUpdate, Login
from .controllers import (
    registrar_usuario,
    login_usuario,
    obtener_perfil,
    actualizar_perfil,
    cambiar_rol,
    obtener_usuarios
)

router = APIRouter()

@router.post("/registro")
async def registro(usuario: Usuario):
    return registrar_usuario(usuario)

@router.post("/login")
async def login(datos: Login):
    return login_usuario(datos.correo, datos.contrasena)

@router.get("/perfil/{correo}")
async def perfil(correo: str):
    return obtener_perfil(correo)

@router.put("/perfil/{correo}")
async def actualizar(correo: str, datos: PerfilUpdate = Body(...)):
    return actualizar_perfil(correo, datos.dict(exclude_unset=True))

@router.put("/rol/{correo}")
async def cambiarRol(correo: str, body: dict = Body(...)):
    nuevo_rol = body.get("nuevo_rol")
    return cambiar_rol(correo, nuevo_rol)

@router.get("/todos")
async def listar_usuarios():
    return obtener_usuarios()
