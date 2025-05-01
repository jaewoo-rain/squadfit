from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
from rtc import handle_offer, add_ice_candidate

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/signaling")
async def signaling(websocket: WebSocket):
    await websocket.accept()
    pc = None
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)

            if msg["type"] == "offer":
                pc = await handle_offer(msg["sdp"], websocket)
            elif msg["type"] == "candidate" and pc:
                await add_ice_candidate(pc, msg["candidate"])
    except:
        pass
    finally:
        if pc:
            await pc.close()
        await websocket.close()

@app.get("/")
async def index():
    return FileResponse("static/index.html")

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)