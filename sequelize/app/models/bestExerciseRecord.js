module.exports = (sequelize, DataTypes) => {
  const BestExerciseRecord = sequelize.define('BestExerciseRecord', {
    best_record_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exercise_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    volumn: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'best_exercise_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // 갱신 안 하는 테이블로 가정
  });

  // 관계 설정
  BestExerciseRecord.associate = (models) => {
    BestExerciseRecord.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    BestExerciseRecord.belongsTo(models.ExerciseType, {
      foreignKey: 'exercise_type_id',
      onDelete: 'CASCADE',
    });

    BestExerciseRecord.belongsTo(models.ExerciseRecord, {
      foreignKey: 'exercise_record_id',
      onDelete: 'CASCADE',
    });
  };

  return BestExerciseRecord;
};
