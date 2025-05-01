// ✅ app.js (WebRTC + 게임 로직 포함)
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let peerConnection;
let dataChannel;
let score = 0;

let fallingX = Math.random() * 640;
let fallingY = -50;
let lastUpdateTime = Date.now();

const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

signalingSocket.onopen = async () => {
  console.log("✅ signaling 서버 연결됨");

  peerConnection = new RTCPeerConnection(config);
  dataChannel = peerConnection.createDataChannel("game");

  dataChannel.onopen = () => {
    console.log("🎮 DataChannel 열림");
  };

  signalingSocket.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    } else if (data.type === "candidate") {
      if (data.candidate) {
        await peerConnection.addIceCandidate(data.candidate);
      }
    } else if (data.type === "hit" && data.hit) {
      score++;
      scoreElem.innerText = `점수: ${score}`;
      reset();
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(JSON.stringify({
        type: "candidate",
        candidate: event.candidate
      }));
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  video.srcObject = stream;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  animate();
};

function reset() {
  fallingX = Math.random() * 600 + 20;
  fallingY = -50;
}

function animate() {
  requestAnimationFrame(animate);
  const now = Date.now();
  const dt = (now - lastUpdateTime) / 1000; // 초 단위
  lastUpdateTime = now;

  // 좌표 업데이트
  fallingY += dt * 100; // 100px/sec 속도

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // 좌표를 서버로 전송
  if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(JSON.stringify({ x: fallingX, y: fallingY }));
  }

  if (fallingY > 500) {
    reset();
  }
}
