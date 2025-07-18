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

/**
 * localhost:8080/api/bestExerciseRecords/searchTopRecord/:exercise_type_id
 */
// 유형별 Top10 기록 조회하기
// const searchTopRecord = async (req, res) => {
//   try {
//     const result = await bestExerciseRecordService.종목으로기록조회(req.params.exercise_type_id);
//     res.json({ message: "Top 10 기록", records: result });
//   } catch (err) {
//     res.status(401).json({ message: err.message });
//   }
// };




// /**
//  * localhost:8080/api/bestExerciseRecords/search/exercise_record_id
//  */
// // 기록 단건 조회 
// const searchById = async (req, res) => {
//   try {
//     const result = await bestExerciseRecordService.단건조회(req.params.id);
//     res.json({ message: "단일 조회 성공", record: result });
//   } catch (err) {
//     res.status(401).json({ message: err.message });
//   }
// };

// // 종목별 조회
// const searchByType = async (req, res) => {
//   try{
//     const result = await bestExerciseRecordService.종목별조회(req.params.exercise_type, req.params.id)
//     res.json({ message: "종목별 조회 성공", record: result });
//   }catch(err){
//     res.status(401).json({message: err.message})
//   }
// }

// // 기록 삭제
// const remove = async (req, res) => {
//   try {
//     await bestExerciseRecordService.기록삭제(req.body.record_id);
//     res.json({ message: "삭제 완료" });
//   } catch (err) {
//     res.status(500).json({ message: "삭제 실패" });
//   }
// };

// // const search = async (req, res) => {
// //   try {
// //     const users = await exerciseRecordService.searchUsers(req.query);
// //     res.json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: "검색 실패" });
// //   }
// // };

module.exports = {
  searchTopUser,
  // searchTopRecord
};
