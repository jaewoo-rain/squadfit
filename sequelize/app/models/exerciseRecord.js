module.exports = (sequelize, DataTypes) => {
  const ExerciseRecord = sequelize.define(
    "ExerciseRecord",
    {
      exercise_record_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      exercise_type_id: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      repeat_number: DataTypes.INTEGER,
      volumn: DataTypes.INTEGER,
      success_number: DataTypes.INTEGER,
      fail_number: DataTypes.INTEGER,
      // 정확도 넣기
    },
    {
      tableName: "exercise_records",
      timestamps: true,
    }
  );

  ExerciseRecord.associate = (models) => {
    ExerciseRecord.belongsTo(models.User, { 
      foreignKey: "user_id",
      onDelete: 'CASCADE',
    });
    ExerciseRecord.belongsTo(models.ExerciseType, {
      foreignKey: "exercise_type_id",
      onDelete: 'CASCADE',
    });
  };

  return ExerciseRecord;
};
