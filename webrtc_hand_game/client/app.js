const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let peerConnection;
let dataChannel;
let score = 0;

const signalingSocket = new WebSocket("ws://192.168.0.4:8000/ws/signaling");

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

let fallingX = Math.random() * 600 + 20;
let fallingY = -50;

function resetFallingObject() {
  fallingY = -50;
  fallingX = Math.random() * 600 + 20;
}

function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 빨간 공 그리기
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  fallingY += 5;
  if (fallingY > 480) {
    resetFallingObject();
  }
}

signalingSocket.onopen = async () => {
  console.log("✅ signaling 서버 연결됨");

  peerConnection = new RTCPeerConnection(config);

  // ✅ DataChannel 생성
  dataChannel = peerConnection.createDataChannel("target");
  dataChannel.onopen = () => {
    console.log("📨 DataChannel open");
  };

  // ICE 처리
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(
        JSON.stringify({ type: "candidate", ...event.candidate })
      );
    }
  };

  // hit 수신
  signalingSocket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === "hit" && data.hit) {
      score++;
      scoreElem.innerText = `점수: ${score}`;
      resetFallingObject();
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
  video.srcObject = stream;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  // ✅ 좌표 주기 전송
  setInterval(() => {
    if (dataChannel && dataChannel.readyState === "open") {
      dataChannel.send(JSON.stringify({ x: fallingX, y: fallingY }));
    }
  }, 150);
};

animate();
