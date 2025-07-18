const { sequelize, BestExerciseRecord, ExerciseType, User, ExerciseRecord } = require("./../models");


// 기록 추가하기 -> 기록 id를 돌려줘야함
const create = async (user_id, exercise_type_id, exercise_record_id, volumn) => {
  return await BestExerciseRecord.create({user_id, exercise_type_id, exercise_record_id, volumn});
};

// 최고기록 갱신하기
const update = async (best_record_id, exercise_record_id) => {
  return await BestExerciseRecord.update(
    { exercise_record_id },
    { where: { best_record_id } }
  );
};

// 유저의 최고 기록 조회
const findByUser = async (user_id) => {
  return await BestExerciseRecord.findAll({
    where: { user_id: user_id },
    include:[
      {
        model: ExerciseType,
        required: true,
      },{
        model: User,
        required: true,
      },{
        model: ExerciseRecord,
        required: true,
      }
    ]
  });
};

// 유저의 특정 종목의 최고기록 조회
const findByUserAndType = async (user_id, exercise_type_id) => {
  return await BestExerciseRecord.findOne({
    where: { user_id, exercise_type_id },
    include: [{ model: ExerciseRecord }],
  });
};


// 종목의 최고 기록 조회
const findByType = async (exercise_type_id)=>{
    return await BestExerciseRecord.findAll({
        where:{exercise_type_id},
        include: [{ model: ExerciseRecord }],    
    })
}


// TOP 10명의 기록
const findTopUser = async (exercise_type_id) => {
  return await sequelize.query(
    `
    WITH ranked_records AS (
      SELECT 
        er.exercise_record_id,
        er.user_id,
        er.exercise_type_id,
        er.weight,
        er.repeat_number,
        er.volumn,
        er.success_number,
        er.fail_number,
        er.createdAt,
        er.updatedAt,
        u.name AS user_name,
        et.exercise_name,
        ROW_NUMBER() OVER (
          PARTITION BY er.user_id
          ORDER BY er.volumn DESC, er.createdAt ASC
        ) AS rn
      FROM exercise_records er
      JOIN \`Users\` u ON er.user_id = u.user_id
      JOIN exercise_type et ON er.exercise_type_id = et.exercise_type_id
      WHERE er.exercise_type_id = :exercise_type_id
    )
    SELECT *
    FROM ranked_records
    WHERE rn = 1
    ORDER BY volumn DESC
    LIMIT 10;
    `,
    {
      replacements: { exercise_type_id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
};



module.exports = {
    create,
    findByUser,
    findByUserAndType,
    findByType,
    update,
    findTopUser,
    // findTopRecord
};
