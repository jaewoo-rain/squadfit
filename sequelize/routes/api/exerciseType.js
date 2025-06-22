const express = require("express");
const router = express.Router();
const { ExerciseType } = require("../../models");

// 전체 조회
router.get("/", async (req, res) => {
  try {
    const types = await ExerciseType.findAll();
    res.json(types);
  } catch (err) {
    res
      .status(500)
      .json({ message: "운동 유형 조회 실패", error: err.message });
  }
});

// 단일 조회
router.get(":id", async (req, res) => {
  try {
    const type = await ExerciseType.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: "운동 유형 없음" });
    res.json(type);
  } catch (err) {
    res
      .status(500)
      .json({ message: "운동 유형 조회 실패", error: err.message });
  }
});

// 생성
router.post("/", async (req, res) => {
  try {
    const { exercise_name } = req.body;
    const newType = await ExerciseType.create({ exercise_name });
    res.status(201).json(newType);
  } catch (err) {
    res
      .status(500)
      .json({ message: "운동 유형 생성 실패", error: err.message });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const { exercise_name } = req.body;
    const [updated] = await ExerciseType.update(
      { exercise_name },
      { where: { exercise_type_id: req.params.id } }
    );
    if (updated) {
      const updatedType = await ExerciseType.findByPk(req.params.id);
      return res.json(updatedType);
    }
    res.status(404).json({ message: "운동 유형 없음" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "운동 유형 수정 실패", error: err.message });
  }
});

// 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ExerciseType.destroy({
      where: { exercise_type_id: req.params.id },
    });
    if (deleted) return res.json({ message: "삭제 성공" });
    res.status(404).json({ message: "운동 유형 없음" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "운동 유형 삭제 실패", error: err.message });
  }
});

module.exports = router;
