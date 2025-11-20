import os
import requests
from fastapi import HTTPException

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8218529530:AAExRSCQKtVyqTESkCrrCer2qVYdf5vbhzI")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "1079111785")

def enviar_telegram(notificacion):
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": f"📢 *{notificacion.asunto}*\n\n{notificacion.mensaje}",
            "parse_mode": "Markdown"
        }

        response = requests.post(url, json=payload)

        print("=== DEBUG TELEGRAM ===")
        print("URL:", url)
        print("PAYLOAD:", payload)
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)
        print("======================")

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Error enviando mensaje: {response.text}")

        return {"mensaje": "Notificación enviada correctamente por Telegram"}

    except Exception as e:
        print("ERROR EN enviar_telegram:", e)
        raise HTTPException(status_code=500, detail=f"Error al enviar notificación: {str(e)}")
