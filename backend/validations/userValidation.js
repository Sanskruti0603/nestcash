const { body } = require("express-validator");

const loginValidation = () => [
  body("email").notEmpty().withMessage("Email is required.").toLowerCase(),
  body("password").notEmpty().withMessage("Password is required."),
];

const registerValidation = () => [
  body("name").notEmpty().withMessage("UserName is required"),
    body("email").notEmpty().withMessage("Email is required.").toLowerCase(),
    body("password").notEmpty().withMessage("Password is required."),
    body("phone").notEmpty().withMessage("Phone is required."),
    body("account_type")
      .notEmpty()
      .withMessage("Account Type is required.")
      .isIn(["saving", "current"])
      .withMessage("Account Name should be valid string.")
];

module.exports = {
  loginValidation,
  registerValidation,
};
