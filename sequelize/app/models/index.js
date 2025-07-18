const Sequelize = require("sequelize");
const sequelize = require("./../db");

const db = {}; // 최종 export될 객체

// Sequelize와 인스턴스 등록
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 불러오기
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.ExerciseRecord = require("./exerciseRecord")(sequelize, Sequelize.DataTypes);
db.ExerciseType = require("./exerciseType")(sequelize, Sequelize.DataTypes);
db.BestExerciseRecord = require("./bestExerciseRecord")(sequelize, Sequelize.DataTypes)

// 관계 설정 수행
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
