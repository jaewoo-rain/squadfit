from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
import base64, json, cv2, numpy as np
import mediapipe as mp

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

mp_hands = mp.solutions.hands
hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
HIT_RADIUS = 50

@app.websocket("/ws/result")
async def result_socket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            parsed = json.loads(data)
            image_data = base64.b64decode(parsed["image"].split(",")[1])
            np_img = np.frombuffer(image_data, np.uint8)
            frame = cv2.imdecode(np_img, 1)

            target_x = parsed["target"]["x"]
            target_y = parsed["target"]["y"]

            frame = cv2.flip(frame, 1)  # ✅ 좌우 반전
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hand_model.process(rgb)

            hit = False
            if results.multi_hand_landmarks:
                for hand in results.multi_hand_landmarks:
                    index = hand.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                    x = int(index.x * frame.shape[1])
                    y = int(index.y * frame.shape[0])
                    dist = ((x - target_x)**2 + (y - target_y)**2)**0.5
                    if dist < HIT_RADIUS:
                        hit = True
                        break

            await websocket.send_text(json.dumps({"hit": hit}))
    except:
        pass