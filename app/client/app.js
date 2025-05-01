const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElem = document.getElementById("score");

let score = 0;
let fallingY = -50;
let fallingX = Math.random() * 580 + 30;
const velocity = 100; // px/sec 기준 속도
let lastTime = performance.now();

const ws = new WebSocket("ws://192.168.0.4:8000/ws/result");

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.hit) {
    score++;
    scoreElem.innerText = `점수: ${score}`;
    resetFallingObject();
  }
};

const hiddenCanvas = document.createElement("canvas");
hiddenCanvas.width = 640;
hiddenCanvas.height = 480;
const hiddenCtx = hiddenCanvas.getContext("2d");

function resetFallingObject() {
  fallingY = -50;
  fallingX = Math.random() * 580 + 30;
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = (now - lastTime) / 1000; // 초 단위
  lastTime = now;

  fallingY += velocity * delta;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(fallingX, fallingY, 20, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  if (fallingY > 480) resetFallingObject();
}

setInterval(() => {
  hiddenCtx.drawImage(video, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
  const frame = hiddenCanvas.toDataURL("image/jpeg");
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({ image: frame, target: { x: fallingX, y: fallingY } })
    );
  }
}, 150);

animate();
