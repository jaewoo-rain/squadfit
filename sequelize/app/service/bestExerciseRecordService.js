const exerciseRecordRepository = require("../repository/exerciseRecordRepository");
const exerciseTypeRepository = require("../repository/exerciseTypeRepository");
const bestExerciseRecordRepository = require("../repository/bestExerciseRecordRepository");
const responseRecordDto = require("../dto/responseRecordDto");
const responseTopUserDto = require("../dto/responseTopUserDto");

const 기록갱신 = async (user_id, exercise_type_id, volumn, exercise_record_id) => {
    // const { user_id, exercise_type_id, volumn, exercise_record_id } = newRecord;

    const existingBest = await bestExerciseRecordRepository.findByUserAndType(user_id, exercise_type_id);

    if (!existingBest) {
        // 최고기록이 없으면 최초 등록
        await bestExerciseRecordRepository.create(user_id, exercise_type_id, exercise_record_id, volumn);
        return "최초 등록 완료";
    }

    const prevVolumn = existingBest.ExerciseRecord.volumn;

    if (volumn > prevVolumn) {
        // 최고기록 갱신
        await bestExerciseRecordRepository.update(existingBest.best_record_id, exercise_record_id, volumn);
        return "최고기록 갱신 완료";
    }
  
    return "기록이 최고기록보다 낮음 (갱신 없음)";
};

const 종목으로탑유저 = async (exercise_type_id) => {

  const result = await bestExerciseRecordRepository.findTopUser(exercise_type_id);

  if (!result || result.length === 0) {
    throw new Error("존재하지 않는 ID입니다.");
  }
  // console.log(result)
  // DTO 변환
  const dto = result.map((record) => {
    const result = new responseTopUserDto(record)
    return result
  });
  return dto;
};


// const 종목으로기록조회 = async (exercise_type_id) => {

//   const result = await bestExerciseRecordRepository.findTopRecord(exercise_type_id);

//   if (!result || result.length === 0) {
//     throw new Error("존재하지 않는 ID입니다.");
//   }
//   console.log(result)
//   // DTO 변환
//   const dto = result.map((record) => {
//     const result = new responseTopUserDto(record)
//     return result
//   });
//   return dto;
// };




// const 단건조회 = async (exercise_record_id) => {
//   const record = await exerciseRecordRepository.findById(exercise_record_id);
//   if(!record){
//     throw new Error("존재하지 않는 ID 입니다.")
//   }
//     const data = record.dataValues;
//     const exercise_name = record.ExerciseType?.exercise_name || "알 수 없음";
//     const dto = new responseRecordDto({...data, exercise_name: exercise_name})

//   return dto;
// };

// const 종목별조회 = async (exercise_type_id, user_id) => {
//   const records = await exerciseRecordRepository.findByType(exercise_type_id, user_id)
//     if (!records || records.length === 0) {
//     throw new Error("존재하지 않는 ID입니다.");
//   }

//   // DTO 변환
//   const dto = records.map((record) => {
//     const data = record.dataValues;
//     const exercise_name = record.ExerciseType?.exercise_name || "알 수 없음";
//     const result = new responseRecordDto({...data, exercise_name:exercise_name})
//     return result
//   });
//   return dto;
// };

// const 기록삭제 = async (exercise_record_id) => {
//   const record = await exerciseRecordRepository.findById(exercise_record_id);
//   if(!record){
//     throw new Error("존재하지 않는 ID 입니다.")
//   }
//   return await exerciseRecordRepository.deleteRecord(exercise_record_id);
// };

// const searchUsers = async (age) => {
//   return await userRepository.selectAge(age);
// };

module.exports = {
  기록갱신,
  // 종목으로기록조회,
  종목으로탑유저,
};
