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
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg["type"] == "offer":
                pc, _ = await handle_offer(msg["sdp"], websocket)
                connections[websocket] = pc

            elif msg["type"] == "candidate":
                if pc:
                    await add_ice_candidate(pc, msg)
    except Exception as e:
        print("❌ WebSocket 종료:", e)
    finally:
        await websocket.close()
        if pc:
            await pc.close()
        connections.pop(websocket, None)
