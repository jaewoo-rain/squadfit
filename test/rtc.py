import json, random, time, asyncio
import cv2, mediapipe as mp
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
        super().__init__()
        self.track = track
        self.dc = data_channel
        self.hand_model = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
        self.falling_x = 320
        self.falling_y = 0
        self.speed = 150
        self.hit_registered = False
        self.last_time = None

    async def recv(self):
        frame = await self.track.recv()
        img = frame.to_ndarray(format="bgr24")
        img = cv2.flip(img, 1)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # 시간 계산
        now = time.time()
        if self.last_time is None:
            self.last_time = now
        dt = now - self.last_time
        self.last_time = now
        self.falling_y += self.speed * dt

        # MediaPipe 추론 (스레드 풀로 넘겨 event loop 블로킹 방지)
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(None, self.hand_model.process, rgb)

        # 히트 감지
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

        # 게임 이벤트 P2P 전송
        if self.dc and self.dc.readyState == "open":
            self.dc.send(json.dumps({"type": "position", "x": self.falling_x, "y": self.falling_y}))
            if hit:
                self.dc.send(json.dumps({"type": "hit", "hit": True}))

        # 리셋
        if hit or self.falling_y > 480:
            self.falling_x = random.randint(100, 540)
            self.falling_y = 0
            self.hit_registered = False

        return frame

async def handle_offer(sdp, websocket):
    pc = RTCPeerConnection()
    data_channel = None

    @pc.on("datachannel")
    def on_datachannel(channel):
        nonlocal data_channel
        data_channel = channel

    @pc.on("track")
    def on_track(track):
        if track.kind == "video":
            pc.addTrack(InferenceTrack(track, data_channel))

    @pc.on("icecandidate")
    async def on_icecandidate(candidate):
        if candidate:
            await websocket.send_text(json.dumps({
                "type": "candidate",
                "candidate": {
                    "candidate": candidate.candidate,
                    "sdpMid": candidate.sdpMid,
                    "sdpMLineIndex": candidate.sdpMLineIndex,
                }
            }))

    @pc.on("iceconnectionstatechange")
    def on_state_change():
        print("ICE 상태 →", pc.iceConnectionState)

    # Offer/Answer
    await pc.setRemoteDescription(RTCSessionDescription(sdp=sdp, type="offer"))
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await websocket.send_text(json.dumps({"type": "answer", "sdp": pc.localDescription.sdp}))
    return pc

async def add_ice_candidate(pc, candidate):
    ice = RTCIceCandidate(
        sdpMid=candidate["sdpMid"],
        sdpMLineIndex=candidate["sdpMLineIndex"],
        candidate=candidate["candidate"]
    )
    await pc.addIceCandidate(ice)