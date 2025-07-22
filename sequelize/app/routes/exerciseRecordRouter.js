// const express = require("express");
// const router = express.Router();
// const exerciseRecordController = require("../controller/exerciseRecordController");

// router.post("/saveRecord", exerciseRecordController.saveRecord);
// router.get("/searchAll/:id", exerciseRecordController.searchAll);
// router.get("/search/:id", exerciseRecordController.searchById);
// router.get("/searchType/:exercise_type/:user_id", exerciseRecordController.searchByType)
// router.delete("/search/delete",exerciseRecordController.remove) ;

// module.exports = router;


const express = require("express");
const router = express.Router();
const exerciseRecordController = require("../controller/exerciseRecordController");

/**
 * @swagger
 * /api/exerciseRecords/saveRecord:
 *   post:
 *     tags:
 *       - Exercise Records
 *     summary: 운동 기록 저장
 *     description: 사용자의 운동 기록을 저장하고 최고 기록과 비교하여 처리 결과를 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               weight:
 *                 type: number
 *               repeat_number:
 *                 type: integer
 *               success_number:
 *                 type: integer
 *               fail_number:
 *                 type: integer
 *               exercise_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 저장 성공 또는 최고 기록 비교 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     exercise_record_id:
 *                       type: integer
 *                       example: 5
 *                     message:
 *                       type: string
 *                       example: >
 *                         최초 등록 완료 또는 기록이 최고기록보다 낮음 (갱신 없음)
 *             examples:
 *               최초 등록:
 *                 value:
 *                   result:
 *                     exercise_record_id: 5
 *                     message: 최초 등록 완료
 *               기록 낮음:
 *                 value:
 *                   result:
 *                     exercise_record_id: 6
 *                     message: 기록이 최고기록보다 낮음 (갱신 없음)
 */



router.post("/saveRecord", exerciseRecordController.saveRecord);

/**
 * @swagger
 * /api/exerciseRecords/searchAll/{user_id}:
 *   get:
 *     tags:
 *       - Exercise Records
 *     summary: 전체 기록 조회
 *     description: 특정 사용자 ID의 전체 운동 기록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: 사용자 ID
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
 *                   example: 전체 조회성공
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exercise_record_id:
 *                         type: integer
 *                         example: 6
 *                       exercise_name:
 *                         type: string
 *                         example: 푸쉬업
 *                       weight:
 *                         type: number
 *                         example: 30
 *                       repeat_number:
 *                         type: integer
 *                         example: 3
 *                       volumn:
 *                         type: number
 *                         example: 90
 *                       success_number:
 *                         type: integer
 *                         example: 5
 *                       fail_number:
 *                         type: integer
 *                         example: 5
 */
router.get("/searchAll/:user_id", exerciseRecordController.searchAll);

/**
 * @swagger
 * /api/exerciseRecords/search/{exercise_record_id}:
 *   get:
 *     tags:
 *       - Exercise Records
 *     summary: 특정 기록 조회
 *     description: 운동 기록 ID로 단일 기록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: exercise_record_id
 *         required: true
 *         description: 운동 기록 ID
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
 *                   example: 단일 조회 성공
 *                 record:
 *                   type: object
 *                   properties:
 *                     exercise_record_id:
 *                       type: integer
 *                       example: 3
 *                     exercise_name:
 *                       type: string
 *                       example: 푸쉬업
 *                     weight:
 *                       type: number
 *                       example: 50
 *                     repeat_number:
 *                       type: integer
 *                       example: 2
 *                     volumn:
 *                       type: number
 *                       example: 100
 *                     success_number:
 *                       type: integer
 *                       example: 5
 *                     fail_number:
 *                       type: integer
 *                       example: 5
 */
router.get("/search/:exercise_record_id", exerciseRecordController.searchById);

/**
 * @swagger
 * /api/exerciseRecords/searchType/{exercise_type}/{user_id}:
 *   get:
 *     tags:
 *       - Exercise Records
 *     summary: 종목별 기록 조회
 *     description: 특정 사용자 ID와 운동 종목으로 기록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: exercise_type
 *         required: true
 *         description: 운동 종목
 *         schema:
 *           type: string
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: 사용자 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 종목별 기록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 종목별 조회 성공
 *                 record:
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
 *                       weight:
 *                         type: number
 *                         example: 50
 *                       repeat_number:
 *                         type: integer
 *                         example: 2
 *                       volumn:
 *                         type: number
 *                         example: 100
 *                       success_number:
 *                         type: integer
 *                         example: 5
 *                       fail_number:
 *                         type: integer
 *                         example: 5
 */

router.get("/searchType/:exercise_type_id/:user_id", exerciseRecordController.searchByType);

/**
 * @swagger
 * /api/exerciseRecords/search/delete:
 *   delete:
 *     tags:
 *       - Exercise Records
 *     summary: 기록 삭제
 *     description: 특정 운동 기록을 삭제합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exercise_record_id:
 *                 type: integer
 *                 description: 삭제할 운동 기록 ID
 *                 example: 5
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exercise_record_id:
 *                   type: integer
 *                   example: 5
 */

router.delete("/search/delete", exerciseRecordController.remove);

module.exports = router;
