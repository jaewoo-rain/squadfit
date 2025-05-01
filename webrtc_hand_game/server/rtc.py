import json
import random
import time
import cv2
import numpy as np
import mediapipe as mp

from aiortc import (
    RTCPeerConnection,
    RTCSessionDescription,
    RTCIceCandidate,
    VideoStreamTrack,
)
from av import VideoFrame

mp_hands = mp.solutions.hands
HIT_RADIUS = 50

class InferenceTrack(VideoStreamTrack):
    def __init__(self, track, websocket):
        super().__init__()
        self.track = track
        self.ws = websocket
        self.hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
        self.last_model_refresh = time.time()
        self.falling_x = 320
        self.falling_y = 100
        self.last_time = None
        self.speed = 150
        self.hit_registered = False

    async def recv(self):
        now = time.time()
        # 60초마다 MediaPipe 모델 재생성
        if now - self.last_model_refresh > 60:
            print("🔄 Restarting MediaPipe")
            self.hand_model.close()
            self.hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
            self.last_model_refresh = now

        # 시간 계산
        if self.last_time is None:
            self.last_time = now
        dt = now - self.last_time
        self.last_time = now
        self.falling_y += self.speed * dt

        # 프레임 수신
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        img = cv2.flip(img, 1)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 손 인식
        results = self.hand_model.process(rgb)
        hit = False
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                idx = hand.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                x = int(idx.x * img.shape[1])
                y = int(idx.y * img.shape[0])
                dist = ((x - self.falling_x)**2 + (y - self.falling_y)**2)**0.5
                if dist < HIT_RADIUS and not self.hit_registered:
                    hit = True
                    self.hit_registered = True
                    break

        # 클라이언트로 전송 (hit & position)
        try:
            await self.ws.send_text(json.dumps({"type": "hit", "hit": hit}))
            await self.ws.send_text(
                json.dumps({"type": "position", "x": self.falling_x, "y": self.falling_y})
            )
        except Exception:
            pass

        # 재생성
        if hit or self.falling_y > 480:
            self.falling_x = random.randint(100, 540)
            self.falling_y = 0
            self.hit_registered = False

        return frame

async def handle_offer(sdp, websocket):
    pc = RTCPeerConnection()

    @pc.on("track")
    def on_track(track):
        print("📹 Track received")
        if track.kind == "video":
            pc.addTrack(InferenceTrack(track, websocket))

    @pc.on("iceconnectionstatechange")
    def on_state_change():
        print("ICE state =", pc.iceConnectionState)

    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="offer"))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    # answer 보내기
    await websocket.send_text(json.dumps({"type": "answer", "sdp": pc.localDescription.sdp}))
    return pc

async def add_ice_candidate(pc, candidate):
    try:
        ice = RTCIceCandidate(
            candidate=candidate["candidate"],
            sdpMid=candidate["sdpMid"],
            sdpMLineIndex=candidate["sdpMLineIndex"],
        )
        await pc.addIceCandidate(ice)
    except Exception as e:
        print("ICE candidate error:", e)
