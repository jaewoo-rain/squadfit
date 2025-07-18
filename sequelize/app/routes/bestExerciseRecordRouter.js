const express = require("express");
const router = express.Router();
const bestExerciserRecordController = require("../controller/bestExerciserRecordController");

router.get("/searchTopUser/:exercise_type_id", bestExerciserRecordController.searchTopUser);
// router.get("/searchTopRecord/:exercise_type_id", bestExerciserRecordController.searchTopRecord);

module.exports = router;
