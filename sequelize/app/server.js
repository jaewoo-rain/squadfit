// server.js
const app = require("./app");
const { sequelize } = require("./models");

const PORT = 8080;

(async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => {
        console.log("DB 연결 성공");
        return sequelize.sync({ alter: true }); // 데이터 구조 변환 허용, 개발할때만 사용하기, 전체 삭제 하고싶담녀 force: true하기
      })
      .then(() => {
        console.log("테이블 동기화 완료");
        app.listen(8080, () => {
          console.log("서버연결 성공 http://localhost:8080");
        });
      })
      .catch((err) => {
        console.error("DB 연결 또는 동기화 실패", err);
      });
  } catch (err) {
    console.error("❌ DB 연결 실패:", err);
  }
})();
