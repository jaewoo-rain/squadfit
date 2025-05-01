# rtc.py
import json
import random
import time
import asyncio

import cv2
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
    def __init__(self, track, data_channel):
        super().__init__()  # initialize base
        self.track = track
        self.dc = data_channel
        self.hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
        self.falling_x = 320
        self.falling_y = 0
        self.speed = 150  # px/sec
        self.hit_registered = False
        self.last_time = None

    async def recv(self):
        # 1) 원본 프레임 받기
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        img = cv2.flip(img, 1)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 2) 타임스탬프 계산으로 낙하 위치 업데이트
        now = time.time()
        if self.last_time is None:
            self.last_time = now
        dt = now - self.last_time
        self.last_time = now
        self.falling_y += self.speed * dt

        # 3) MediaPipe 추론은 executor에 위임 (이벤트 루프 블로킹 회피)
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(None, self.hand_model.process, rgb)

        # 4) 히트 감지
        hit = False
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                idx = hand.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
                x = int(idx.x * img.shape[1])
                y = int(idx.y * img.shape[0])
                dist = ((x - self.falling_x) ** 2 + (y - self.falling_y) ** 2) ** 0.5
                if dist < HIT_RADIUS and not self.hit_registered:
                    hit = True
                    self.hit_registered = True
                    break

        # 5) DataChannel로 위치·히트 정보 전송
        if self.dc and self.dc.readyState == "open":
            self.dc.send(json.dumps({
                "type": "position",
                "x": self.falling_x,
                "y": self.falling_y
            }))
            if hit:
                self.dc.send(json.dumps({"type": "hit", "hit": True}))

        # 6) 히트됐거나 화면 밖으로 나가면 초기화
        if hit or self.falling_y > 480:
            self.falling_x = random.randint(100, 540)
            self.falling_y = 0
            self.hit_registered = False

        return frame

async def handle_offer(sdp, websocket):
    pc = RTCPeerConnection()
    data_channel = None

    # 클라이언트가 createDataChannel로 P2P DataChannel 생성하면 여기서 잡힌다
    @pc.on("datachannel")
    def on_datachannel(channel):
        nonlocal data_channel
        data_channel = channel

    # 비디오 트랙 수신 시 InferenceTrack으로 감싸서 추가
    @pc.on("track")
    def on_track(track):
        if track.kind == "video":
            inf = InferenceTrack(track, data_channel)
            pc.addTrack(inf)

    @pc.on("iceconnectionstatechange")
    def on_state_change():
        print("ICE state →", pc.iceConnectionState)

    # Offer/Answer 교환
    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="offer"))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    # Answer는 WebSocket으로 전달
    await websocket.send_text(json.dumps({
        "type": "answer",
        "sdp": pc.localDescription.sdp
    }))
    return pc

async def add_ice_candidate(pc, candidate):
    ice = RTCIceCandidate(
        sdpMid=candidate["sdpMid"],
        sdpMLineIndex=candidate["sdpMLineIndex"],
        candidate=candidate["candidate"]
    )
    await pc.addIceCandidate(ice)
