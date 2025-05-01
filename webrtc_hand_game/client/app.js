// 📁 client/app.js
const video = document.getElementById("video");
const scoreElem = document.getElementById("score");

let peerConnection;
let dataChannel;
let score = 0;

// const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");
const signalingSocket = new WebSocket("ws://192.168.0.4:8000/ws/signaling");

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

let fallingX = 320;
let fallingY = -50;
const velocity = 100;
let lastTime = performance.now();

signalingSocket.onopen = async () => {
  console.log("✅ signaling 서버 연결됨");

  peerConnection = new RTCPeerConnection(config);

  // ICE candidate 수신 처리
  signalingSocket.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
    } else if (data.type === "candidate") {
      try {
        await peerConnection.addIceCandidate({
          candidate: data.candidate,
          sdpMid: data.sdpMid,
          sdpMLineIndex: data.sdpMLineIndex
        });
      } catch (e) {
        console.error("ICE candidate 오류:", e);
      }
    } else if (data.type === "hit") {
      if (data.hit) {
        score++;
        scoreElem.innerText = `점수: ${score}`;
        resetFalling();
      }
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(JSON.stringify({
        type: "candidate",
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex
      }));
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  video.srcObject = stream;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  // RTCDataChannel 설정
  dataChannel = peerConnection.createDataChannel("target");
};

function resetFalling() {
  fallingY = -50;
  fallingX = Math.random() * 580 + 30;
}

function sendTarget() {
  if (dataChannel && dataChannel.readyState === "open") {
    dataChannel.send(JSON.stringify({ x: fallingX, y: fallingY }));
  }
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  fallingY += velocity * delta;
  sendTarget();

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  if (fallingY > 480) resetFalling();
}

animate();
