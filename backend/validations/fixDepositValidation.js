const { body, param } = require("express-validator");

const addFDValidation = () => [
  body("account")
    .notEmpty()
    .withMessage("Account id is required")
    .isMongoId()
    .withMessage("Accound from Mongodb id is required"),
  body("amount").isNumeric().notEmpty().withMessage("Amount is required."),
  body("apply_for").notEmpty().withMessage("Purpose of FD is required."),
];

const FDIdValidation = () => [
  param("id")
    .notEmpty()
    .withMessage("FD id is required")
    .isMongoId()
    .withMessage("FD from Mongodb id is required"),
];

module.exports = {
  addFDValidation,
  FDIdValidation,
};
