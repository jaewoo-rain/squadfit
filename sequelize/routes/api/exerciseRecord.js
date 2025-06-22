const express = require("express");
const router = express.Router();
const {
  ExerciseRecord,
  BestExerciseRecord,
  ExerciseType,
} = require("../../models");
const { Op, Sequelize } = require("sequelize");

// 전체 조회
router.get("/", async (req, res) => {
  try {
    const records = await ExerciseRecord.findAll({ include: [ExerciseType] });
    res.json(records);
  } catch (err) {
    console.error("운동 기록 조회 실패:", err);
    res.status(500).json({ message: "운동 기록 조회 실패" });
  }
});

// 단일 조회
router.get("/:id", async (req, res) => {
  try {
    const record = await ExerciseRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "기록 없음" });
    res.json(record);
  } catch (err) {
    console.error("운동 기록 단건 조회 실패:", err);
    res.status(500).json({ message: "운동 기록 단건 조회 실패" });
  }
});

// 생성 + BestExerciseRecord 갱신
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      exercise_type_id,
      weight,
      repeat_number,
      volumn,
      success_number,
      fail_number,
    } = req.body;

    const newRecord = await ExerciseRecord.create({
      user_id,
      exercise_type_id,
      weight,
      repeat_number,
      volumn,
      success_number,
      fail_number,
    });

    // 현재 가장 높은 volumn 기록 불러오기
    const best = await BestExerciseRecord.findOne({
      where: { user_id },
      include: {
        model: ExerciseRecord,
        where: { exercise_type_id },
      },
    });

    // 새 기록이 최고 기록이면 업데이트
    if (!best || newRecord.volumn > best.ExerciseRecord.volumn) {
      await BestExerciseRecord.upsert({
        user_id,
        exercise_record_id: newRecord.exercise_record_id,
      });
    }

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("운동 기록 생성 실패:", err);
    res.status(500).json({ message: "운동 기록 생성 실패" });
  }
});

// 수정
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await ExerciseRecord.update(req.body, {
      where: { exercise_record_id: req.params.id },
    });
    if (updated) {
      const updatedRecord = await ExerciseRecord.findByPk(req.params.id);
      return res.json(updatedRecord);
    }
    res.status(404).json({ message: "기록 없음" });
  } catch (err) {
    console.error("운동 기록 수정 실패:", err);
    res.status(500).json({ message: "운동 기록 수정 실패" });
  }
});

// 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ExerciseRecord.destroy({
      where: { exercise_record_id: req.params.id },
    });
    if (deleted) return res.json({ message: "삭제 성공" });
    res.status(404).json({ message: "기록 없음" });
  } catch (err) {
    console.error("운동 기록 삭제 실패:", err);
    res.status(500).json({ message: "운동 기록 삭제 실패" });
  }
});

module.exports = router;
