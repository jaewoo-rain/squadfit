const requestSavaRecordDto = require("../dto/requestSavaRecordDto");
const exerciseRecordService = require("./../service/exerciseRecordService");

// 기록 저장하기
const saveRecord = async (req, res) => {
  try {
    const dto = new requestSavaRecordDto(req.body);
    const result = await exerciseRecordService.저장하기(dto);
    // console.log(result);
    res.status(201).json({ result: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 기록 전체조회하기
const searchAll = async (req, res) => {
  try {
    const records = await exerciseRecordService.전체조회(req.params.id);
    res.json({ message: "전체 조회성공", records: records });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// 기록 단건 조회
const searchById = async (req, res) => {
  try {
    const record = await exerciseRecordService.단건조회(req.params.id);
    res.json({ message: "단일 조회 성공", record: record });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// const remove = async (req, res) => {
//   try {
//     await exerciseRecordService.계정삭제(req.params.id);
//     res.json({ message: "삭제 완료" });
//   } catch (err) {
//     res.status(500).json({ message: "삭제 실패" });
//   }
// };

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
};
