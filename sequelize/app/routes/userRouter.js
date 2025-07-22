// const express = require("express");
// const router = express.Router();
// const userController = require("../controller/userController");

// router.post("/register", userController.register);
// router.post("/login", userController.login);
// router.post("/logout", userController.logout);
// // router.delete("/:id", userController.remove);
// router.get("/search", userController.search);

// module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: 회원가입
 *     description: 새로운 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               height:
 *                 type: int
 *               weight:
 *                 type: int
 *               gender:
 *                 type: string
 *               age:
 *                 type: int
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   example: 2
 *       400:
 *         description: 회원가입 실패
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: 로그인
 *     description: 사용자 로그인 처리
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 user:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: jaewoo
 *                       age:
 *                         type: integer
 *                         example: 30
 *                       height:
 *                         type: int
 *                         example: 300
 *                       weight:
 *                         type: int
 *                         example: 200
 *                       gender:
 *                         type: string
 *                         example: M
 *       401:
 *         description: 로그인 실패
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: 로그아웃
 *     description: 사용자 로그아웃 처리
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post("/logout", userController.logout);

// /**
//  * @swagger
//  * /api/users/search:
//  *   get:
//  *     tags:
//  *       - Users
//  *     summary: 사용자 목록 검색
//  *     description: 모든 사용자 또는 일부 조건에 맞는 사용자 목록을 조회합니다.
//  *     responses:
//  *       200:
//  *         description: 사용자 목록 반환
//  */
// router.get("/search", userController.search);

module.exports = router;
