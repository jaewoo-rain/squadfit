from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from rtc_receiver import handle_offer, add_ice_candidate
import json

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
connections = {}

@app.websocket("/ws/signaling")
async def signaling(websocket: WebSocket):
    await websocket.accept()
    print("📡 signaling client connected")
    pc = None

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            if data["type"] == "offer":
                pc = await handle_offer(data["sdp"], websocket)
                connections[websocket] = pc
            elif data["type"] == "candidate":
                await add_ice_candidate(pc, data)

    except Exception as e:
        print("❌ WebSocket 종료:", e)
    finally:
        if websocket in connections:
            await connections[websocket].close()
            del connections[websocket]