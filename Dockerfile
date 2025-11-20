# Usa una imagen ligera de Python
FROM python:3.11-slim

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto del backend
EXPOSE 5000

# Comando para ejecutar el backend
CMD ["python", "main.py"]
