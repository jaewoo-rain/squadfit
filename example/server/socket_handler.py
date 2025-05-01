# 파일: server/socket_handler.py
import json
from fastapi import WebSocket

class WebSocketGameHandler:
    def __init__(self, game, method_name="check_hit"):
        self.game = game
        self.method_name = method_name

    async def handle(self, websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                raw = await websocket.receive_text()
                parsed = json.loads(raw)
                fn = getattr(self.game, self.method_name)
                result = fn(parsed)
                await websocket.send_json(result)
        except Exception as e:
            print("WebSocket error:", e)
