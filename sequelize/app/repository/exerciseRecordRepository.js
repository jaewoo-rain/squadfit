const { sequelize, ExerciseRecord, ExerciseType } = require("./../models");


// 기록 추가하기 -> 기록 id를 돌려줘야함
const createRecord = async (createRecordDto) => {
  return await ExerciseRecord.create(createRecordDto);
};

// 전체 기록 불러오기
// 이후 페이징 기능
const findAll = async (user_id) => {
  return await ExerciseRecord.findAll({ 
    where: { user_id: user_id }, 
    include:[
      {
        model: ExerciseType,
        attributes: ["exercise_name"],
        required: true,
      }
    ]
  });
};

// 단일 기록 불러오기
const findById = async (exercise_record_id) => {
  return await ExerciseRecord.findOne({
    where: { exercise_record_id: exercise_record_id },
    include:[
      {
        model: ExerciseType,
        attributes: ["exercise_name"],
        required: true,
      }
    ]
  });
};

// 특정 종목 불러오기
const findByType = async (exercise_type_id, user_id) => {
  return await ExerciseRecord.findAll({
    where: {
      user_id: user_id,
      exercise_type_id: exercise_type_id
    },
    include: [
      {
        model: ExerciseType,
        attributes: ["exercise_name"],
        required: true
      }
    ]
  });
};

// const findByType = async (exercise_type_id, user_id) => {
//   const [results] = await sequelize.query(
//     "SELECT * FROM exercise_records WHERE user_id = :user_id and exercise_type_id = :exercise_type_id ",
//     {
//       replacements: { user_id, exercise_type_id },
//       type: sequelize.QueryTypes.SELECT,
//     }
//   );
//   return results;
// };

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
