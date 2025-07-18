// app.js
const express = require("express");
const cors = require("cors");
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 본문 파싱
app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱

// 라우터 불러오기
const userRouter = require("./routes/userRouter");
const exerciseRecordRouter = require("./routes/exerciseRecordRouter");
const besetExerciseRecordRouter = require("./routes/bestExerciseRecordRouter");
app.use("/api/users", userRouter);
app.use("/api/exerciseRecords", exerciseRecordRouter);
app.use("/api/bestExerciseRecords",besetExerciseRecordRouter);

// 기본 루트
app.get("/", (req, res) => {
  res.send("🏋️‍♂️ SquadFit 서버 실행 중!");
});

// 에러 처리 (선택)
app.use((err, req, res, next) => {
  console.error("에러 발생:", err.message);
  res.status(500).json({ error: "서버 내부 오류" });
});

module.exports = app;
