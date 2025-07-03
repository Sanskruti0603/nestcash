const { body } = require("express-validator");

const addMoneyValidation = () => [
  body("account_no").notEmpty().withMessage("Account Number is required."),
  body("amount").isNumeric().notEmpty().withMessage("Amount is required"),
];

const addAccountValidation = () => [
  body("account_type")
    .notEmpty()
    .withMessage("account type is required")
    .isIn(["saving", "current"])
    .withMessage("invalid type"),
];

module.exports = {
  addMoneyValidation,
  addAccountValidation,
};
