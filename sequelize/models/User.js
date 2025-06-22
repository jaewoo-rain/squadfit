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
    User.hasMany(models.MatchRecord, {
      foreignKey: "enemy_user_id",
      as: "EnemyMatches",
    });
    User.belongsToMany(models.ExerciseRecord, {
      through: models.BestExerciseRecord,
      foreignKey: "user_id",
    });
  };

  return User;
};
