const video     = document.getElementById("video");
const canvas    = document.getElementById("canvas");
const ctx       = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let pc, dc;
let fallingX = 320, fallingY = 100, score = 0;

const signaling = new WebSocket("ws://192.168.0.4:8000/ws/signaling");
signaling.onopen = async () => {
  console.log("📡 시그널링 연결됨");

  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  // 1) 게임용 DataChannel 생성 → 서버 on_datachannel로 잡힘
  dc = pc.createDataChannel("game");
  dc.onopen = () => console.log("🎮 DataChannel open");
  dc.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.type === "position") {
      fallingX = msg.x;
      fallingY = msg.y;
    } else if (msg.type === "hit" && msg.hit) {
      score++;
      scoreElem.innerText = score;
    }
  };

  // 2) Remote 비디오 받기
  pc.ontrack = event => {
    if (!video.srcObject) video.srcObject = event.streams[0];
  };

  // 3) ICE 후보 송신
  pc.onicecandidate = e => {
    if (e.candidate) {
      signaling.send(JSON.stringify({ type: "candidate", candidate: e.candidate.toJSON() }));
    }
  };

  // 4) 로컬 카메라 가져와 트랙 추가
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 320, height: 240, frameRate: 15 },
    audio: false
  });
  stream.getTracks().forEach(t => pc.addTrack(t, stream));

  // 5) Offer 생성 및 전송
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signaling.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  render();
};

signaling.onmessage = async e => {
  const msg = JSON.parse(e.data);
  if (msg.type === "answer") {
    await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp }));
  } else if (msg.type === "candidate") {
    try { await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); }
    catch {};
  }
};

function render() {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}