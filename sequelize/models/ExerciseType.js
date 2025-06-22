module.exports = (sequelize, DataTypes) => {
  const ExerciseType = sequelize.define("ExerciseType", {
    exercise_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    exercise_name: DataTypes.STRING,
  });

  // 연관관계

  ExerciseType.associate = (models) => {
    ExerciseType.hasMany(models.ExerciseRecord, {
      foreignKey: "exercise_type_id",
    });
  };

  return ExerciseType;
};
