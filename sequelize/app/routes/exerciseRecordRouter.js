const express = require("express");
const router = express.Router();
const exerciseRecordController = require("../controller/exerciseRecordController");

router.post("/saveRecord", exerciseRecordController.saveRecord);
router.get("/searchAll/:id", exerciseRecordController.searchAll);
router.get("/search/:id", exerciseRecordController.searchById);
router.get("/searchType/:exercise_type/:user_id", exerciseRecordController.searchByType)
router.delete("/search/delete",exerciseRecordController.remove) ;

module.exports = router;
