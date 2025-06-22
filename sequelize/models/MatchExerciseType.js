module.exports = (sequelize, DataTypes) => {
  const MatchExerciseType = sequelize.define("MatchExerciseType", {
    match_exercise_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    match_exercise_name: DataTypes.STRING,
    repeat_number: DataTypes.INTEGER,
  });

  // 연관관계

  MatchExerciseType.associate = (models) => {
    MatchExerciseType.hasMany(models.MatchRecord, {
      foreignKey: "match_exercise_type_id",
    });
  };

  return MatchExerciseType;
};
