const express = require("express");
const app = express();

app.use(express.json()); // JSON 형식 POST 요청 받을 수 있게 설정
app.use("/api", require("./route/api.js"));
const pool = require("./database.js");

app.listen(8080, () => {
  console.log("서버연결 성공 http://localhost:8080");
});

app.use(express.static(__dirname + "/public"));

app.get("/", (요청, 응답) => {
  응답.send("하이요");
});

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
