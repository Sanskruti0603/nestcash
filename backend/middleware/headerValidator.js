const Validator = require("validatorjs");

const headerValidator = {
  sendResponse: (res, resCode, msgKey, resData = null) => {
    const responsejson = {
      code: resCode,
      message: msgKey,
    };

    if (resData !== null) {
      responsejson.data = resData;
    }

    return res.status(resCode).json(responsejson);
  },

  async checkValidation(req, rules) {
    try {
      const v = new Validator(req, rules); // ✅ Correct way to instantiate Validator
      const validator = { status: true };

      if (v.fails()) {
        validator.status = false;
        const validateError = v.errors.all();
        for (const key in validateError) {
          validator.error = validateError[key][0];
          break;
        }
      }
      return validator;
    } catch (error) {
      console.log(error);
    }
  },

  async adminRolesOnly(user) {},
};

module.exports = headerValidator;
