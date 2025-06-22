module.exports = (sequelize, DataTypes) => {
  const BestExerciseRecord = sequelize.define("BestExerciseRecord", {
    best_exercise_record_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: DataTypes.INTEGER,
    exercise_record_id: DataTypes.INTEGER,
  });

  // 연관관계

  BestExerciseRecord.associate = (models) => {
    BestExerciseRecord.belongsTo(models.ExerciseRecord, {
      foreignKey: "exercise_record_id",
      onDelete: "CASCADE",
    });
  };

  return BestExerciseRecord;
};
