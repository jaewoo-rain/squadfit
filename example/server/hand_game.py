# 파일: server/hand_game.py
import base64
import numpy as np
import cv2
import mediapipe as mp

class HandGame:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hand_model = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.HIT_RADIUS = 50

    def check_hit(self, parsed: dict) -> dict:
        # Base64 → OpenCV 이미지
        image_data = base64.b64decode(parsed["image"].split(",")[1])
        np_img = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # 좌우 반전: 클라이언트 좌표(fallingX)와 일치시키기 위해
        frame = cv2.flip(frame, 1)

        falling_x = parsed["target"]["x"]
        falling_y = parsed["target"]["y"]

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hand_model.process(rgb)

        hit = False
        landmarks = []

        if results.multi_hand_landmarks:
            hand = results.multi_hand_landmarks[0]
            idx = hand.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
            x = int(idx.x * frame.shape[1])
            y = int(idx.y * frame.shape[0])

            distance = ((x - falling_x) ** 2 + (y - falling_y) ** 2) ** 0.5
            hit = distance < self.HIT_RADIUS

            landmarks = [
                {"x": lm.x, "y": lm.y, "z": lm.z}
                for lm in hand.landmark
            ]

        return {"hit": hit, "landmarks": landmarks}
