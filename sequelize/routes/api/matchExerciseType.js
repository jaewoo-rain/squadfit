const express = require("express");
const router = express.Router();
const { MatchExerciseType } = require("../../models");

// 전체 조회
router.get("/", async (req, res) => {
  try {
    const data = await MatchExerciseType.findAll();
    res.json(data);
  } catch (err) {
    console.error("MatchExerciseType 조회 실패:", err);
    res.status(500).json({ message: "조회 실패" });
  }
});

// 단일 조회
router.get("/:id", async (req, res) => {
  try {
    const item = await MatchExerciseType.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "존재하지 않음" });
    res.json(item);
  } catch (err) {
    console.error("MatchExerciseType 단일 조회 실패:", err);
    res.status(500).json({ message: "단일 조회 실패" });
  }
});

// 생성
router.post("/", async (req, res) => {
  try {
    const { match_exercise_name, repeat_number } = req.body;
    const newItem = await MatchExerciseType.create({
      match_exercise_name,
      repeat_number,
    });
    res.status(201).json(newItem);
  } catch (err) {
    console.error("MatchExerciseType 생성 실패:", err);
    res.status(500).json({ message: "생성 실패" });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const { match_exercise_name, repeat_number } = req.body;
    const [updated] = await MatchExerciseType.update(
      { match_exercise_name, repeat_number },
      { where: { match_exercise_type_id: req.params.id } }
    );

    if (updated) {
      const updatedItem = await MatchExerciseType.findByPk(req.params.id);
      return res.json(updatedItem);
    }
    res.status(404).json({ message: "수정 대상 없음" });
  } catch (err) {
    console.error("MatchExerciseType 수정 실패:", err);
    res.status(500).json({ message: "수정 실패" });
  }
});

// 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MatchExerciseType.destroy({
      where: { match_exercise_type_id: req.params.id },
    });

    if (deleted) return res.json({ message: "삭제 성공" });
    res.status(404).json({ message: "삭제 대상 없음" });
  } catch (err) {
    console.error("MatchExerciseType 삭제 실패:", err);
    res.status(500).json({ message: "삭제 실패" });
  }
});

module.exports = router;
