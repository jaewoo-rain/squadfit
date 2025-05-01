# main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
from rtc import handle_offer, add_ice_candidate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# static/index.html 및 app.js 제공
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.websocket("/ws/signaling")
async def signaling(websocket: WebSocket):
    await websocket.accept()
    pc = None
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg["type"] == "offer":
                # Offer 받으면 RTCPeerConnection 생성 및 답변까지 처리
                pc = await handle_offer(msg["sdp"], websocket)

            elif msg["type"] == "candidate" and pc:
                # ICE 후보 추가
                await add_ice_candidate(pc, msg["candidate"])

    except Exception:
        pass
    finally:
        if pc:
            await pc.close()
        await websocket.close()
