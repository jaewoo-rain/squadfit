// app.js
const video     = document.getElementById("video");
const canvas    = document.getElementById("canvas");
const ctx       = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let pc, dc;
let fallingX = 320, fallingY = 100, score = 0;

// 1) 시그널링 WebSocket 연결
const signaling = new WebSocket("ws://localhost:8000/ws/signaling");
signaling.onopen = async () => {
  console.log("📡 Signaling connected");

  // 2) RTCPeerConnection 생성 (STUN만 사용)
  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  // ICE 후보 전송
  pc.onicecandidate = e => {
    if (e.candidate) {
      signaling.send(JSON.stringify({
        type: "candidate",
        candidate: e.candidate.toJSON()
      }));
    }
  };

  // 3) 서버 측 DataChannel 받기
  pc.ondatachannel = e => {
    dc = e.channel;
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
  };

  // 4) 비디오 스트림 가져와서 서버에 트랙 추가
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 320, height: 240, frameRate: 15 },
    audio: false
  });
  stream.getTracks().forEach(t => pc.addTrack(t, stream));

  // 5) Offer/Answer 교환
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  signaling.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));

  // 렌더 루프 시작
  render();
};

// 시그널링 메시지 처리
signaling.onmessage = async e => {
  const msg = JSON.parse(e.data);
  if (msg.type === "answer") {
    await pc.setRemoteDescription(new RTCSessionDescription({
      type: "answer", sdp: msg.sdp
    }));
  }
  else if (msg.type === "candidate") {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    } catch {}
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
