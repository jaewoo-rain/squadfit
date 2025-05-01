const video = document.getElementById("video");
const scoreElem = document.getElementById("score");

let peerConnection;
let dataChannel;
let score = 0;
let fallingX = Math.random() * 580 + 30;
let fallingY = -50;
const velocity = 100;
let lastTime = performance.now();

// const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");
const signalingSocket = new WebSocket("ws://192.168.0.4:8000/ws/signaling");

signalingSocket.onopen = async () => {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  dataChannel = peerConnection.createDataChannel("target");

  signalingSocket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    } else if (data.type === "candidate") {
      await peerConnection.addIceCandidate(data);
    } else if (data.type === "hit" && data.hit) {
      score++;
      scoreElem.innerText = `점수: ${score}`;
      resetTarget();
    }
  };

  peerConnection.onicecandidate = (e) => {
    if (e.candidate) {
        signalingSocket.send(JSON.stringify({
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex
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
  sendTargetLoop();
};

function resetTarget() {
  fallingX = Math.random() * 580 + 30;
  fallingY = -50;
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;
  fallingY += velocity * delta;
  if (fallingY > 480) resetTarget();
}

function sendTargetLoop() {
  setInterval(() => {
    if (dataChannel?.readyState === "open") {
      dataChannel.send(JSON.stringify({ type: "target", x: fallingX, y: fallingY }));
    }
  }, 100);
}
