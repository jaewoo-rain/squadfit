const { sequelize, User } = require("./../models");

// 로그인 아이디로 유저 찾기
const findByLoginId = async (username) => {
  return await User.findOne({ where: { username: username } });
};

// 유저 생성
/**
 * userData = {
 *  username: user1
 *  password: 1234
 *  age : 20
 *  ...
 * }
 */
const createUser = async (userData) => {
  return await User.create(userData);
};

// 유저 삭제
const deleteUser = async (user_id) => {
  return await User.destroy({ where: { user_id: user_id } });
};

// 특정나이 이상 반환 (연습용)
const selectAge = async (age) => {
  const [results] = await sequelize.query(
    "SELECT * FROM user WHERE age >= :age",
    {
      replacements: { age },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return results;
};

module.exports = {
  findByLoginId,
  createUser,
  deleteUser,
  selectAge,
};
