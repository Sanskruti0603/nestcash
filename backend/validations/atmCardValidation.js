const { body, param } = require("express-validator");
const { CARD_TYPE } = require("../utils/constant");

const addAtmValidation = () => [
  body("account")
    .notEmpty()
    .withMessage("Account is required for getting ATM Card.")
    .isMongoId()
    .withMessage("Mongo db id required."),
  body("card_type")
    .notEmpty()
    .withMessage("Card Type is required.")
    .isIn(Object.keys(CARD_TYPE))
    .withMessage("Invalid Credentials."),
  body("pin")
    .notEmpty()
    .withMessage("Pin is required.")
    .isLength({ min: 4, max: 4 })
    .withMessage("Length of pin should be 4."),
];

const withdrawMoneyAtmValidation = () => [
  body("pin")
    .notEmpty()
    .withMessage("Pin is required.")
    .isLength({ min: 4, max: 4 })
    .withMessage("Length of pin should be 4."),
  body("amount").isNumeric().notEmpty().withMessage("Amount is required."),
];

const atmIdValidation = () => [
  param("id")
    .notEmpty()
    .withMessage("Atm Id is required.")
    .isMongoId()
    .withMessage("Mongo Id reuquired.")
];

module.exports = {
  addAtmValidation,
  withdrawMoneyAtmValidation,
  atmIdValidation,
};
