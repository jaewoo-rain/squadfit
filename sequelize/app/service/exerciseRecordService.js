const responseRecordDto = require("../dto/responseRecordDto");
const responseSaveRecordDto = require("../dto/responseSaveRecordDto");
const exerciseRecordRepository = require("../repository/exerciseRecordRepository");
const exerciseTypeRepository = require("../repository/exerciseTypeRepository");

const 저장하기 = async (requestSavaRecordDto) => {
  // this.exercise_type_id = body.exercise_type_id;
  const exercise_type_id = await exerciseTypeRepository.findByName(
    requestSavaRecordDto.exercise_name
  );

  console.log(exercise_type_id);
  const volumn =
    requestSavaRecordDto.weight * requestSavaRecordDto.repeat_number;

  const result = await exerciseRecordRepository.createRecord({
    ...requestSavaRecordDto,
    volumn: volumn,
    exercise_type_id: exercise_type_id,
  });
  
  // console.log(result);
  return new responseSaveRecordDto(result);
};

const 전체조회 = async (user_id) => {
  const records = await exerciseRecordRepository.findAll(user_id);
  if (!records || records.length === 0) {
    throw new Error("존재하지 않는 ID입니다.");
  }

  // DTO 변환
  const dto = records.map((record) => {
    const data = record.dataValues;
    const exercise_name = record.ExerciseType?.exercise_name || "알 수 없음";
    const result = new responseRecordDto({...data, exercise_name:exercise_name})
    return result
  });
  return dto;
};


const 단건조회 = async (exercise_record_id) => {
  const record = await exerciseRecordRepository.findById(exercise_record_id);
  if(!record){
    throw new Error("존재하지 않는 ID 입니다.")
  }
    const data = record.dataValues;
    const exercise_name = record.ExerciseType?.exercise_name || "알 수 없음";
    const dto = new responseRecordDto({...data, exercise_name: exercise_name})

  return dto;
};

const 종목별조회 = async (exercise_type_id, user_id) => {
  const records = await exerciseRecordRepository.findByType(exercise_type_id, user_id)
    if (!records || records.length === 0) {
    throw new Error("존재하지 않는 ID입니다.");
  }

  // DTO 변환
  const dto = records.map((record) => {
    const data = record.dataValues;
    const exercise_name = record.ExerciseType?.exercise_name || "알 수 없음";
    const result = new responseRecordDto({...data, exercise_name:exercise_name})
    return result
  });
  return dto;
};

const 기록삭제 = async (exercise_record_id) => {
  const record = await exerciseRecordRepository.findById(exercise_record_id);
  if(!record){
    throw new Error("존재하지 않는 ID 입니다.")
  }
  return await exerciseRecordRepository.deleteRecord(exercise_record_id);
};

// const searchUsers = async (age) => {
//   return await userRepository.selectAge(age);
// };

module.exports = {
  저장하기,
  전체조회,
  단건조회,
  종목별조회,
  기록삭제,
};
