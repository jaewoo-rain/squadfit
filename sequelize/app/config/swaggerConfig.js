// config/swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const specs = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SquadFit API',
      version: '1.0.0',
      description: '운동 기록 관련 API 문서입니다.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '개발 서버',
      },
    ],
  },
    apis: ['./routes/*.js'],// 주석 문서화 하지 않을 경우 빈 배열
});


module.exports = {
  swaggerUi,
  specs,
};
