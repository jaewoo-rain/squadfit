class UserRegisterDto {
  constructor(body) {
    this.login_id = body.login_id;
    this.password = body.password;
    this.name = body.name;
    this.age = body.age;
    this.height = body.height;
    this.weight = body.weight;
    this.gender = body.gender;

    this.validate();
  }

  validate() {
    if (!this.login_id || !this.password || !this.name) {
      throw new Error("필수 항목이 누락되었습니다.");
    }

    if (this.age && isNaN(this.age)) {
      throw new Error("나이는 숫자여야 합니다.");
    }
  }
}

module.exports = UserRegisterDto;
