model.exports = (sequelize, DataType) => {
  const User = sequelize.define("User", {
    user_id: { type: DataType.INTEGER },
  });
};
