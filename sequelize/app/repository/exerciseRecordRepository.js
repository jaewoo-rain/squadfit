const { sequelize, ExerciseRecord } = require("./../models");

  /**
  {
    "user_id":"5",
    "weight":"60",
    "repeat_number":"3",
    "success_number":"8",
    "fail_number":"2",
    "exercise_name":"스쿼트"
  }
  **/

// 기록 추가하기 -> 기록 id를 돌려줘야함
const createRecord = async (createRecordDto) => {
  return await ExerciseRecord.create(createRecordDto);
};

// 전체 기록 불러오기
const findAll = async (user_id) => {
  return await ExerciseRecord.findAll({ where: { user_id: user_id } });
};

// 단일 기록 불러오기
const findById = async (exercise_record_id) => {
  return await ExerciseRecord.findOne({
    where: { exercise_record_id: exercise_record_id },
  });
};

// 특정 종목
const findByType = async (exercise_type_id) => {
  const [results] = await sequelize.query(
    "SELECT * FROM exercise_records WHERE exercise_type_id = :exercise_type_id",
    {
      replacements: { exercise_type_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return results;
};

// 기록 삭제
const deleteRecord = async (exercise_record_id) => {
  return await ExerciseRecord.destroy({
    where: { exercise_record_id: exercise_record_id },
  });
};

module.exports = {
  createRecord,
  findAll,
  findById,
  findByType,
  deleteRecord,
};
