import json
import cv2
import numpy as np
import mediapipe as mp
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, VideoStreamTrack
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

        await self.websocket.send_text(json.dumps({
            "type": "hit",
            "hit": hit
        }))
        return frame

async def handle_offer(sdp, websocket):
    pc = RTCPeerConnection()
    track_ref = {}

    @pc.on("track")
    def on_track(track):
        print("📹 track received")
        if track.kind == "video":
            inference = InferenceTrack(track, websocket)
            track_ref["track"] = inference
            pc.addTrack(inference)

    @pc.on("datachannel")
    def on_datachannel(channel):
        print("📨 datachannel opened")
        @channel.on("message")
        def on_message(msg):
            try:
                target = json.loads(msg)
                if "x" in target and "y" in target and "track" in track_ref:
                    track_ref["track"].set_target(target["x"], target["y"])
            except:
                pass

    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="offer"))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    await websocket.send_text(json.dumps({ "type": "answer", "sdp": pc.localDescription.sdp }))
    return pc, track_ref

async def add_ice_candidate(pc, msg):
    if "candidate" in msg and "sdpMid" in msg and "sdpMLineIndex" in msg:
        ice = RTCIceCandidate(
            candidate=msg["candidate"],
            sdpMid=msg["sdpMid"],
            sdpMLineIndex=msg["sdpMLineIndex"]
        )
        await pc.addIceCandidate(ice)