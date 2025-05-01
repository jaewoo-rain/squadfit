const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let peerConnection;
let dataChannel;
let score = 0;

// 물체 좌표 및 속도
let fallingX = Math.random() * 580 + 30;
let fallingY = -50;
const radius = 20;
const fallSpeed = 200; // 픽셀/초 단위 (낮을수록 느림)

// WebSocket signaling
// const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");
const signalingSocket = new WebSocket("ws://192.168.0.4:8000/ws/signaling");

signalingSocket.onopen = async () => {
  console.log("✅ signaling 서버 연결됨");

  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // DataChannel 생성
  dataChannel = peerConnection.createDataChannel("game");

  // DataChannel 연결되었을 때 서버에 좌표 보내기
  dataChannel.onopen = () => {
    console.log("📨 DataChannel 열림");
    sendTargetLoop(); // 좌표 주기적으로 전송 시작
  };

  // WebSocket 메시지 처리
  signalingSocket.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data)
      );
    } else if (data.type === "candidate") {
      if (data.candidate) {
        await peerConnection.addIceCandidate(data.candidate);
      }
    } else if (data.type === "hit") {
      if (data.hit) {
        score++;
        scoreElem.innerText = `점수: ${score}`;
        resetObject();
      }
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(
        JSON.stringify({
          type: "candidate",
          candidate: event.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        })
      );
    }
  };

  // 카메라 설정 및 연결
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
  video.srcObject = stream;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
};

function resetObject() {
  fallingY = -50;
  fallingX = Math.random() * 580 + 30;
}

function sendTargetLoop() {
  setInterval(() => {
    if (dataChannel.readyState === "open") {
      dataChannel.send(JSON.stringify({ x: fallingX, y: fallingY }));
    }
  }, 100); // 0.1초마다 서버에 좌표 전달
}

let lastTime = null;
function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000; // 초 단위
  lastTime = timestamp;

  // 배경 지우기
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 물체 위치 갱신
  fallingY += fallSpeed * delta;

  // 그리기
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  // 화면 아래로 나가면 리셋
  if (fallingY > 480) {
    resetObject();
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
