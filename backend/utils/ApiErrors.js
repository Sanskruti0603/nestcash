class ApiErrors extends Error {
  constructor(code, msg) {
    super(msg);
    this.statusCode = code;
  }
}

module.exports = ApiErrors;
