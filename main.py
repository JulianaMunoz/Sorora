"""
Sorora API 
Backend unificado con FastAPI.
"""

import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ms_albergues.app.controllers import inicializar_albergues
from ms_albergues.app import routes as shelters_routes
from ms_alertas.app import routes as alerts_routes
from ms_usuarios.app import routes as usuarios_routes
from ms_notificaciones.app import routes as notificaciones_routes
from ms_reportes.app import routes as reportes_routes
from ms_noticias.app import routes as noticias_routes


DESCRIPTION = """
API unificada para el sistema Sorora 
"""

app = FastAPI(
    title="Sorora API",
    description=DESCRIPTION,
    version="1.0.0",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(shelters_routes.router, prefix="/shelters", tags=["shelters"])
app.include_router(alerts_routes.router, prefix="/alerts", tags=["alerts"])
app.include_router(usuarios_routes.router, prefix="/usuarios", tags=["usuarios"])
app.include_router(notificaciones_routes.router, prefix="/notificaciones", tags=["notificaciones"])
app.include_router(reportes_routes.router, prefix="/reportes", tags=["reportes"])
app.include_router(noticias_routes.router, prefix="/noticias", tags=["noticias"])

inicializar_albergues()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
