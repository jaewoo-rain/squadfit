const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const port = 8080;
app.listen(port, () => {
  console.log(`서버 연결 성공 http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.render("main.ejs");
});

/*
 * <user>
 * name, login_id, password
 */

// 회원가입
app.get("/users/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/users/register", (req, res) => {
  /*
    회원가입 로직 후 성공 시 이동
    */
  res.redirect("/");
});

// 로그인
app.post("/users/login", (req, res) => {
  /*
   * 로그인 로직 후 성공시 이동
   * 아이디 말고 회원의 이름 건네주기
   */
  res.render("success.ejs", { name: req.body.login_id });
});

// 회원 정보 조회
app.get("/users/list", (req, res) => {
  let users = [
    { name: "홍길동", login_id: "hong123", password: "1234" },
    { name: "이순신", login_id: "lee456", password: "5678" },
  ];

  /*
   * 전체 회원 정보 뿌리기, 지금은 임시데이터 사용중
   */
  res.json(users);
});
