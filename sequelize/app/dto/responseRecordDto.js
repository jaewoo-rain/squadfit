class responseRecordDto {
  constructor(body) {
    this.exercise_record_id = body.exercise_record_id;
    this.exercise_name = body.exercise_name;
    this.weight = body.weight;
    this.repeat_number = body.repeat_number;
    this.volumn = body.volumn;
    this.success_number = body.success_number;
    this.fail_number = body.fail_number;
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

module.exports = responseRecordDto;
