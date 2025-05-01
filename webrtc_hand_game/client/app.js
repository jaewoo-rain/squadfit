const video = document.getElementById("video");
const scoreElem = document.getElementById("score");

let peerConnection;
let score = 0;

// WebSocket으로 signaling 서버에 연결
// const signalingSocket = new WebSocket("ws://localhost:8000/ws/signaling");
const signalingSocket = new WebSocket("ws://192.168.0.4:8000/ws/signaling");

// WebRTC 설정
const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

// signaling 연결 성공 시
signalingSocket.onopen = async () => {
  console.log("✅ signaling 서버 연결됨");

  peerConnection = new RTCPeerConnection(config);

  // 서버에서 보낸 ICE candidate 수신
  signalingSocket.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "answer") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    } else if (data.type === "candidate") {
      try {
        await peerConnection.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("ICE candidate 오류:", e);
      }
    } else if (data.type === "hit") {
      // 추론 결과 수신
      if (data.hit) {
        score++;
        scoreElem.innerText = `점수: ${score}`;
      }
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      signalingSocket.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
    }
  };

  // 로컬 비디오 스트림 설정
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  video.srcObject = stream;

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  signalingSocket.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
};
