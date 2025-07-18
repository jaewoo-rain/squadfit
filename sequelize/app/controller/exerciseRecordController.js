const requestSavaRecordDto = require("../dto/requestSavaRecordDto");
const exerciseRecordService = require("./../service/exerciseRecordService");


// localhost:8080/api/exerciseRecords/saveRecord

/**
 * {
    "user_id":"1",
    "weight":"80",
    "repeat_number":"3",
    "success_number":"8",
    "fail_number":"2",
    "exercise_name":"스쿼트"
 * }
 */
// 기록 저장하기
const saveRecord = async (req, res) => {
  try {
    const dto = new requestSavaRecordDto(req.body);
    const exercise_record_id = await exerciseRecordService.저장하기(dto);




    // console.log(result);
    res.status(201).json({ result: exercise_record_id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * localhost:8080/api/exerciseRecords/searchAll/user_id
 */
// 기록 전체조회하기
const searchAll = async (req, res) => {
  try {
    const result = await exerciseRecordService.전체조회(req.params.id);
    res.json({ message: "전체 조회성공", records: result });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

/**
 * localhost:8080/api/exerciseRecords/search/exercise_record_id
 */
// 기록 단건 조회 
const searchById = async (req, res) => {
  try {
    const result = await exerciseRecordService.단건조회(req.params.id);
    res.json({ message: "단일 조회 성공", record: result });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// localhost:8080/api/exerciseRecords/searchType/:exercise_type/:user_id
// 종목별 조회
const searchByType = async (req, res) => {
  try{
    const result = await exerciseRecordService.종목별조회(req.params.exercise_type, req.params.user_id)
    res.json({ message: "종목별 조회 성공", record: result });
  }catch(err){
    res.status(401).json({message: err.message})
  }
}

// 기록 삭제
const remove = async (req, res) => {
  try {
    await exerciseRecordService.기록삭제(req.body.record_id);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패" });
  }
};

// const search = async (req, res) => {
//   try {
//     const users = await exerciseRecordService.searchUsers(req.query);
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "검색 실패" });
//   }
// };

module.exports = {
  saveRecord,
  searchAll,
  searchById,
  searchByType,
  remove
};
