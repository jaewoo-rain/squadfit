const express = require("express");
const router = express.Router();
const exerciseRecordController = require("../controller/exerciseRecordController");

router.post("/saveRecord", exerciseRecordController.saveRecord);
router.get("/searchAll/:id", exerciseRecordController.searchAll);
router.get("/search/:id", exerciseRecordController.searchById);
// router.get("/search/all", exerciseRecordController.searchAll);

module.exports = router;
