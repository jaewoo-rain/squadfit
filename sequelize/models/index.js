const Sequelize = require("sequelize");
const sequelize = require("../db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 모델 불러오기
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.ExerciseRecord = require("./ExerciseRecord")(sequelize, Sequelize.DataTypes);
db.ExerciseType = require("./ExerciseType")(sequelize, Sequelize.DataTypes);
db.MatchRecord = require("./MatchRecord")(sequelize, Sequelize.DataTypes);
db.MatchExerciseType = require("./MatchExerciseType")(
  sequelize,
  Sequelize.DataTypes
);
db.BestExerciseRecord = require("./BestExerciseRecord")(
  sequelize,
  Sequelize.DataTypes
);

// associate 호출 (연결)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
