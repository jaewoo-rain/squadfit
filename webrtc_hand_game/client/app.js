const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let peerConnection;
let fallingX = 320;
let fallingY = 100;
let score = 0;

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");

signalingSocket.onopen = async () => {
  console.log("📡 WebSocket connected");

  peerConnection = new RTCPeerConnection(config);

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
      signalingSocket.send(
        JSON.stringify({ type: "candidate", candidate: e.candidate.toJSON() })
      );
    }
  };

  // 받은 트랙(로컬 카메라) 그대로 화면에
  peerConnection.ontrack = (e) => {
    if (!video.srcObject) {
      video.srcObject = e.streams[0];
    }
  };

  signalingSocket.onmessage = async (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: data.sdp })
      );
    } else if (data.type === "position") {
      fallingX = 640 - data.x; // 좌우 반전
      fallingY = data.y;
    } else if (data.type === "hit" && data.hit) {
      score++;
      scoreElem.innerText = score;
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach((t) => peerConnection.addTrack(t, stream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  render();
};

function render() {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}
