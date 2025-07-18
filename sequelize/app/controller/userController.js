const UserLoginDto = require("../dto/userLoginDto");
const UserRegisterDto = require("../dto/userRegisterDto");
const userService = require("./../service/userService");

//localhost:8080/api/users/register
/**
 * {
    "username" : "user2",
    "password" : "1234",
    "name" : "kim",
    "age" : 30,
    "height": 300,
    "weight": 200,
    "gender" : "M"
 * }
 */
const register = async (req, res) => {
  try {
    const dto = new UserRegisterDto(req.body);
    const result = await userService.회원가입(dto);
    res.status(201).json({ user_id: result.user_id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// localhost:8080/api/users/login
/**
 * {
    "username" : "user2",
    "password" : "1234"
 * }
 */
const login = async (req, res) => {
  try {
    const user = await userService.로그인(req.body.username, req.body.password);
    const dto = new UserLoginDto(user);

    // jwt 토큰 발행 코드 추가해야함
    res.json({ message: "로그인 성공", user: dto });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const logout = (req, res) => {
  // 토근 삭제
};

const remove = async (req, res) => {
  try {
    await userService.계정삭제(req.params.id);
    res.json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패" });
  }
};

const search = async (req, res) => {
  try {
    const users = await userService.searchUsers(req.query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "검색 실패" });
  }
};

module.exports = {
  register,
  login,
  logout,
  remove,
  search,
};
