const express = require("express");
const app = express();
const sequelize = require("./db");
const db = require("./models");
const userRoutes = require("./routes/api/user");
const exerciseTypeRoutes = require("./routes/api/exerciseType");
const bestExerciseRecordRoutes = require("./routes/api/bestExerciseRecord");
const exerciseRecordRoutes = require("./routes/api/exerciseRecord");
const matchRecordRoutes = require("./routes/api/matchRecord");
const matchExerciseTypeRoutes = require("./routes/api/matchExerciseType");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/exerciseType", exerciseTypeRoutes);
app.use("/api/bestExerciseRecord", bestExerciseRecordRoutes);
app.use("/api/exerciseRecord", exerciseRecordRoutes);
app.use("/api/matchRecord", matchRecordRoutes);
app.use("/api/matchExerciseType", matchExerciseTypeRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB 연결 성공");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("테이블 동기화 완료");
    app.listen(8080, () => {
      console.log("서버연결 성공 http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("DB 연결 또는 동기화 실패", err);
  });
ㅋ