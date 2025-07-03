const express = require("express");
const accountValidation = require("../../validations/accountValidation");
const router = express.Router();
const accountController = require("../controller/accountController");
const { verifyToken } = require("../../utils/JwtService");

router.post(
  "/add-money",
  accountValidation.addMoneyValidation(),
  verifyToken,
  accountController.addMoney
);
router.post("/verify-payment", verifyToken, accountController.verifyPayment);
router.post(
  "/get-all-transactions",
  verifyToken,
  accountController.getAllTransactions
);
router.post(
  "/get-transaction-byId/:id",
  verifyToken,
  accountController.getTransactionById
);
router.post("/add-account", verifyToken, accountController.addNewAccount);
router.post("/get-all-account", verifyToken, accountController.getAllAccount);

module.exports = router;
