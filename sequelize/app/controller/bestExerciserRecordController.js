const responseTopUserDto = require("../dto/responseTopUserDto");
const bestExerciseRecordService = require("./../service/bestExerciseRecordService");


/**
 * localhost:8080/api/bestExerciseRecords/searchTopUser/:exercise_type_id
 */
// 유형별 Top10 유저 조회하기
const searchTopUser = async (req, res) => {
  try {
    const result = await bestExerciseRecordService.종목으로탑유저(req.params.exercise_type_id);
    res.json({ message: "Top 10 유저", records: result });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = {
  searchTopUser,
  // searchTopRecord
};
