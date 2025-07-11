const bcrypt = require("bcrypt");
const userRepository = require("../repository/userRepository");

const 회원가입 = async (userData) => {
  const existing = await userRepository.findByLoginId(userData.login_id);

  if (existing) throw new Error("이미 존재하는 ID 입니다");

  const hashed = await bcrypt.hash(userData.password, 10);
  return await userRepository.createUser({ ...userData, password: hashed });
};

const 로그인 = async (login_id, password) => {
  const user = await userRepository.findByLoginId(login_id);
  if (!user) throw new Error("존재하지 않는 ID입니다.");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("비밀번호가 일치하지 않습니다.");

  return user;
};

const 계정삭제 = async (user_id) => {
  return await userRepository.deleteUser(user_id);
};

const searchUsers = async (age) => {
  return await userRepository.selectAge(age);
};

module.exports = {
  회원가입,
  로그인,
  계정삭제,
  searchUsers,
};
