from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from rtc_receiver import handle_offer, add_ice_candidate
import json

from rtc_receiver import handle_offer, add_ice_candidate

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

connections = {}

@app.websocket("/ws/signaling")
async def signaling(websocket: WebSocket):
    await websocket.accept()
    print("📡 signaling client connected")

    async for message in websocket.iter_text():
        data = json.loads(message)

        if data["type"] == "offer":
            pc, queue = await handle_offer(data["sdp"], websocket)
            connections[websocket] = (pc, queue)
        elif data["type"] == "candidate":
            await add_ice_candidate(connections[websocket][0], data["candidate"])
