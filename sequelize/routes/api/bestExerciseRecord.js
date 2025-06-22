const express = require("express");
const router = express.Router();
const { BestExerciseRecord } = require("../../models");

// 전체 조회
router.get("/", async (req, res) => {
  try {
    const records = await BestExerciseRecord.findAll();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", detail: err.message });
  }
});

// 단일 조회
router.get("/:id", async (req, res) => {
  try {
    const record = await BestExerciseRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: "Not Found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: "조회 실패", detail: err.message });
  }
});

// 생성
router.post("/", async (req, res) => {
  try {
    const { user_id, exercise_record_id } = req.body;
    const newRecord = await BestExerciseRecord.create({
      user_id,
      exercise_record_id,
    });
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: "생성 실패", detail: err.message });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const { user_id, exercise_record_id } = req.body;
    const [updated] = await BestExerciseRecord.update(
      { user_id, exercise_record_id },
      { where: { best_exercise_record_id: req.params.id } }
    );
    if (updated === 0) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ error: "수정 실패", detail: err.message });
  }
});

// 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await BestExerciseRecord.destroy({
      where: { best_exercise_record_id: req.params.id },
    });
    if (deleted === 0) return res.status(404).json({ error: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패", detail: err.message });
  }
});

module.exports = router;
