const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SquadFit API",
      version: "1.0.0",
      description: "스쿼드핏 API 명세서입니다",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "로컬 서버",
      },
    ],
  },
  apis: ["./routes/*.js", "./controller/*.js", "./dto/*.js"], // JSDoc 주석 작성 파일들
};

const specs = swaggerJsDoc(options);

module.exports = { swaggerUi, specs };
