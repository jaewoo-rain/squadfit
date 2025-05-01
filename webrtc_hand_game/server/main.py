from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from rtc import handle_offer, add_ice_candidate
import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pcs = set()

@app.websocket("/ws/signaling")
async def signaling(websocket: WebSocket):
    await websocket.accept()
    print("📡 Client connected")
    pc = None
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg["type"] == "offer":
                pc = await handle_offer(msg["sdp"], websocket)
                pcs.add(pc)

            elif msg["type"] == "candidate" and pc:
                await add_ice_candidate(pc, msg["candidate"])

    except Exception as e:
        print("❌ Signaling error:", e)
    finally:
        if pc:
            await pc.close()
            pcs.discard(pc)
        await websocket.close()
