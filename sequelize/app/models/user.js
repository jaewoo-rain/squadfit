module.exports = (sequelize, DataType) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataType.STRING,
      username: DataType.STRING,
      password: DataType.STRING,
      height: DataType.FLOAT,
      weight: DataType.FLOAT,
      gender: DataType.STRING,
      age: DataType.INTEGER,
    },
    {
      tableName: "Users",
      timestamps: false,
    }
  );

  // 연관관계
  User.associate = (models) => {
    User.hasMany(models.ExerciseRecord, { foreignKey: "user_id" });
    User.hasMany(models.BestExerciseRecord, { foreignKey: "user_id"})
  };
  return User;
};
