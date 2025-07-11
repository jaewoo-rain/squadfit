const { ExerciseType } = require("./../models");

// 단일 기록 불러오기
const findByName = async (exercise_name) => {
  const result = await ExerciseType.findOne({
    where: { exercise_name: exercise_name },
  });
  console.log(result.exercise_type_id);
  return result.exercise_type_id;
};

module.exports = {
  findByName,
};
