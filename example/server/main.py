# 파일: server/main.py
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from hand_game import HandGame
from socket_handler import WebSocketGameHandler

app = FastAPI()

# static/test.html 등을 제공
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def main_page():
    return FileResponse("main.html")

@app.websocket("/ws/hand")
async def hand_socket(websocket: WebSocket):
    handler = WebSocketGameHandler(HandGame(), method_name="check_hit")
    await handler.handle(websocket)
