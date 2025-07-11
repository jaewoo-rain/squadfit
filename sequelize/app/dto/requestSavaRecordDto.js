class RequestSaveRecordDto {
  constructor(body) {
    this.user_id = body.user_id;
    this.weight = body.weight;
    this.repeat_number = body.repeat_number;
    this.success_number = body.success_number;
    this.fail_number = body.fail_number;
    this.exercise_name = body.exercise_name;
    this.validate();
  }

  validate() {
    // if (!this.login_id || !this.password || !this.name) {
    //   throw new Error("필수 항목이 누락되었습니다.");
    // }
    // if (this.age && isNaN(this.age)) {
    //   throw new Error("나이는 숫자여야 합니다.");
    // }
  }
}

module.exports = RequestSaveRecordDto;
