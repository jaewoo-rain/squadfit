const router = require("express").Router();
const pool = require("./../database.js");

// user 생성
router.post("/users", (req, res) => {
  const { name, login_id, password } = req.body;
  const sql = "insert into users (name, login_id, password) values(?, ?, ?)";
  pool.query(sql, [name, login_id, password], (err, result) => {
    console.log(result);
    if (err) {
      console.error("삽입 실패: ", err);
      return res.status(500).send("삽입 실패");
    }
    res.send({ message: "삽입 성공", insertId: result.insertId });
  });
});

// user 삭제
router.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "delete from users where user_id = ?";
  pool.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("삭제 실패: ", err);
      return res.status(500).send("삭제 실패");
    }
    res.send({ message: "삭제 성공", affectedRows: result.affectedRows });
  });
});

// user 검색
router.get("/users", (req, res) => {
  const sql = "select * from users";
  pool.query(sql, (err, result) => {
    if (err) {
      console.log("검색 실패", err);
      return res.status(500).send("검색 실패");
    }
    res.send({ message: "검색 생공", result: result });
  });
});

module.exports = router;
