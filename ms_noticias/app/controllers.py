# ms_noticias/app/controllers.py
from .fake_data import noticias_falsas

def obtener_noticias():
    # Convierte datetime a string para JSON serializable
    noticias = []
    for n in noticias_falsas:
        noticias.append({
            "id": n["id"],
            "titulo": n["titulo"],
            "descripcion": n["descripcion"],
            "fecha": n["fecha"].isoformat(),
            "autor": n["autor"]
        })
    return noticias
