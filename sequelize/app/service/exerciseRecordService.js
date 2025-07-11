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
  if (!records) throw new Error("존재하지 않는 ID입니다.");
  const dto = records;

  return dto;
};

const 단건조회 = async (exercise_record_id) => {
  const record = await exerciseRecordRepository.findById(exercise_record_id);

  const dto = record;

  return dto;
};

// const 종목별조회 = async () => {};

// const 기록삭제 = async (user_id) => {
//   return await userRepository.deleteUser(user_id);
// };

// const searchUsers = async (age) => {
//   return await userRepository.selectAge(age);
// };

module.exports = {
  저장하기,
  전체조회,
  단건조회,
};
