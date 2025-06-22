module.exports = (sequelize, DataTypes) => {
  const MatchRecord = sequelize.define("MatchRecord", {
    match_record_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: DataTypes.INTEGER,
    enemy_user_id: DataTypes.INTEGER,
    match_exercise_type_id: DataTypes.INTEGER,
    my_record: DataTypes.INTEGER,
    enemy_record: DataTypes.INTEGER,
    win_or_lose: DataTypes.STRING,
  });

  // 연관관계

  MatchRecord.associate = (models) => {
    MatchRecord.belongsTo(models.User, { foreignKey: "user_id" });
    MatchRecord.belongsTo(models.User, {
      foreignKey: "enemy_user_id",
      as: "Enemy",
    });
    MatchRecord.belongsTo(models.MatchExerciseType, {
      foreignKey: "match_exercise_type_id",
    });
  };

  return MatchRecord;
};
