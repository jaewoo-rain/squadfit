const express = require("express");
const router = express.Router();
const bestExerciserRecordController = require("../controller/bestExerciserRecordController");

/**
 * @swagger
 * /api/bestExerciseRecords/searchTopUser/{exercise_type_id}:
 *   get:
 *     tags:
 *       - Best Exercise Records
 *     summary: 최고 기록 사용자 조회
 *     description: 특정 운동 종목에서 가장 높은 기록을 가진 사용자를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: exercise_type_id
 *         required: true
 *         description: 운동 종목 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Top 10 유저
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exercise_record_id:
 *                         type: integer
 *                         example: 3
 *                       exercise_name:
 *                         type: string
 *                         example: 푸쉬업
 *                       user_name:
 *                         type: string
 *                         example: kim
 *                       volumn:
 *                         type: number
 *                         example: 100
 */

router.get("/searchTopUser/:exercise_type_id", bestExerciserRecordController.searchTopUser);

// 향후 추가 가능
// router.get("/searchTopRecord/:exercise_type_id", bestExerciserRecordController.searchTopRecord);

module.exports = router;
