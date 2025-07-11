module.exports = (sequelize, DataTypes) => {
  const ExerciseType = sequelize.define(
    "ExerciseType",
    {
      exercise_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_name: DataTypes.STRING,
    },
    {
      tableName: "exercise_type",
      timestamps: false,
    }
  );

  //   ExerciseType.associate = (models) => {
  //     ExerciseType.hasMany(models.User, {
  //       foreignKey: "exercise_type_id",
  //     });
  //   };

  return ExerciseType;
};
