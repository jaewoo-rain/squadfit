const express = require("express");
const router = express.Router();
const { MatchRecord } = require("../../models");

// 전체 조회
router.get("/", async (req, res) => {
  try {
    const matches = await MatchRecord.findAll();
    res.json(matches);
  } catch (err) {
    console.error("대결 조회 실패:", err);
    res.status(500).json({ message: "대결 조회 실패" });
  }
});

// 단일 조회
router.get("/:id", async (req, res) => {
  try {
    const match = await MatchRecord.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: "대결 기록 없음" });
    res.json(match);
  } catch (err) {
    console.error("대결 조회 실패:", err);
    res.status(500).json({ message: "대결 조회 실패" });
  }
});

// 생성
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      enemy_user_id,
      match_exercise_type_id,
      my_record,
      enemy_record,
      win_or_lose,
    } = req.body;

    const newMatch = await MatchRecord.create({
      user_id,
      enemy_user_id,
      match_exercise_type_id,
      my_record,
      enemy_record,
      win_or_lose,
    });

    res.status(201).json(newMatch);
  } catch (err) {
    console.error("대결 생성 실패:", err);
    res.status(500).json({ message: "대결 생성 실패" });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const {
      user_id,
      enemy_user_id,
      match_exercise_type_id,
      my_record,
      enemy_record,
      win_or_lose,
    } = req.body;

    const [updated] = await MatchRecord.update(
      {
        user_id,
        enemy_user_id,
        match_exercise_type_id,
        my_record,
        enemy_record,
        win_or_lose,
      },
      { where: { match_record_id: req.params.id } }
    );

    if (updated) {
      const updatedMatch = await MatchRecord.findByPk(req.params.id);
      return res.json(updatedMatch);
    }
    res.status(404).json({ message: "대결 기록 없음" });
  } catch (err) {
    console.error("대결 수정 실패:", err);
    res.status(500).json({ message: "대결 수정 실패" });
  }
});

// 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MatchRecord.destroy({
      where: { match_record_id: req.params.id },
    });

    if (deleted) return res.json({ message: "삭제 성공" });
    res.status(404).json({ message: "대결 기록 없음" });
  } catch (err) {
    console.error("대결 삭제 실패:", err);
    res.status(500).json({ message: "대결 삭제 실패" });
  }
});

module.exports = router;
