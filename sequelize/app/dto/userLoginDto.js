class UserLoginDto {
  constructor(body) {
    this.user_id = body.user_id;
    this.name = body.name;
    this.age = body.age;
    this.height = body.height;
    this.weight = body.weight;
    this.gender = body.gender;
  }
}

module.exports = UserLoginDto;
