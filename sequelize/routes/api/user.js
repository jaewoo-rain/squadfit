const express = require("express");
const router = express.Router();
const { User } = require("../../models");

// [GET] 전체 유저 조회
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "유저 조회 실패", error: err.message });
  }
});

// [GET] 특정 유저 조회
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "유저 없음" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "유저 조회 실패", error: err.message });
  }
});

// [POST] 유저 생성
router.post("/", async (req, res) => {
  try {
    const { name, login_id, password } = req.body;
    const newUser = await User.create({ name, login_id, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "유저 생성 실패", error: err.message });
  }
});

// [PUT] 유저 수정
router.put("/:id", async (req, res) => {
  try {
    const { name, login_id, password } = req.body;
    const [updated] = await User.update(
      { name, login_id, password },
      { where: { user_id: req.params.id } }
    );
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      return res.json(updatedUser);
    }
    res.status(404).json({ message: "유저 없음" });
  } catch (err) {
    res.status(500).json({ message: "유저 수정 실패", error: err.message });
  }
});

// [DELETE] 유저 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { user_id: req.params.id } });
    if (deleted) return res.json({ message: "삭제 성공" });
    res.status(404).json({ message: "유저 없음" });
  } catch (err) {
    res.status(500).json({ message: "유저 삭제 실패", error: err.message });
  }
});

module.exports = router;
