module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      login_id: DataTypes.STRING,
      password: DataTypes.STRING,
      height: DataTypes.FLOAT,
      weight: DataTypes.FLOAT,
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
    },
    {
      tableName: "user",
      timestamps: false,
    }
  );

  // 연관관계
  User.associate = (models) => {
    User.hasMany(models.ExerciseRecord, { foreignKey: "user_id" });
    User.hasMany(models.MatchRecord, { foreignKey: "user_id" });
    User.hasMany(models.BestExerciseRecord, { foreignKey: "user_id" });
    User.hasMany(models.MatchRecord, {
      foreignKey: "enemy_user_id",
      as: "EnemyMatches",
    });
  };

  return User;
};
