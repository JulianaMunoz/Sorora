from pymongo import MongoClient
from fastapi import HTTPException
import os

client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client[os.getenv("MONGO_DB", "sorora")]
usuarios = db["usuarios"]

def registrar_usuario(data):
    user_dict = data.dict()
    user_dict.pop("id", None)  # Mongo genera _id automáticamente

    if usuarios.find_one({"correo": user_dict["correo"]}):
        raise HTTPException(status_code=400, detail="Correo ya registrado")

    # Aquí se podría agregar hash de contraseña (bcrypt, etc) para seguridad
    usuarios.insert_one(user_dict)
    return {"msg": "Usuario registrado"}

def login_usuario(correo, contrasena):
    user = usuarios.find_one({"correo": correo, "contrasena": contrasena})
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {"msg": "Login exitoso", "usuario": user["nombre"], "rol": user["rol"]}

def obtener_perfil(correo):
    user = usuarios.find_one({"correo": correo}, {"_id": 0, "contrasena": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

def actualizar_perfil(correo, nuevos_datos):
    resultado = usuarios.update_one({"correo": correo}, {"$set": nuevos_datos})
    if resultado.modified_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o sin cambios")
    return {"msg": "Perfil actualizado"}

def cambiar_rol(correo, nuevo_rol):
    resultado = usuarios.update_one({"correo": correo}, {"$set": {"rol": nuevo_rol}})
    if resultado.modified_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o sin cambios")
    return {"msg": f"Rol cambiado a {nuevo_rol}"}

def obtener_usuarios():
    lista = list(usuarios.find({}, {"_id": 0}))
    return lista
