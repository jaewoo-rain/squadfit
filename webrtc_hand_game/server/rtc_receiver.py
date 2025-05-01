import asyncio
import json
import numpy as np
import cv2
import mediapipe as mp

from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack, RTCIceCandidate
from av import VideoFrame

mp_hands = mp.solutions.hands
hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
HIT_RADIUS = 50

class InferenceTrack(VideoStreamTrack):
    def __init__(self, track, websocket):
        super().__init__()
        self.track = track
        self.websocket = websocket
        self.falling_x = 320
        self.falling_y = 100

    def set_target(self, x, y):
        self.falling_x = x
        self.falling_y = y

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        img = cv2.flip(img, 1)

        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hand_model.process(rgb)

        hit = False
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                index = hand.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                x = int(index.x * img.shape[1])
                y = int(index.y * img.shape[0])
                dist = ((x - self.falling_x) ** 2 + (y - self.falling_y) ** 2) ** 0.5
                if dist < HIT_RADIUS:
                    hit = True
                    break

        await self.websocket.send_text(json.dumps({"type": "hit", "hit": hit}))
        return frame

async def handle_offer(sdp, websocket):
    pc = RTCPeerConnection()
    inference = None

    @pc.on("track")
    def on_track(track):
        nonlocal inference
        print("\U0001f4f9 track received")
        if track.kind == "video":
            inference = InferenceTrack(track, websocket)
            pc.addTrack(inference)

    @pc.on("datachannel")
    def on_datachannel(channel):
        print("📡 DataChannel opened")

        @channel.on("message")
        def on_message(message):
            try:
                data = json.loads(message)
                if data["type"] == "target" and inference:
                    inference.set_target(data["x"], data["y"])
            except Exception as e:
                print("DataChannel error:", e)

    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="offer"))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    await websocket.send_text(json.dumps({
        "type": "answer",
        "sdp": pc.localDescription.sdp
    }))

    return pc

async def add_ice_candidate(pc, candidate_data):
    if "candidate" in candidate_data and "sdpMid" in candidate_data and "sdpMLineIndex" in candidate_data:
        ice = RTCIceCandidate(
            candidate=candidate_data["candidate"],
            sdpMid=candidate_data["sdpMid"],
            sdpMLineIndex=candidate_data["sdpMLineIndex"]
        )
        await pc.addIceCandidate(ice)
    else:
        print("⚠️ 잘못된 ICE candidate 데이터:", candidate_data)