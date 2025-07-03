const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { verifyToken } = require("../../utils/JwtService");

router.post("/login", adminController.login);
router.post("/get-users", verifyToken, adminController.getUsers);
router.post("/get-user/:id", verifyToken, adminController.getUserById);
router.post("/freeze-account", verifyToken, adminController.freezeAccount);
router.post(
  "/get-all-transactions",
  verifyToken,
  adminController.getTransactions
);
router.post("/stats", verifyToken, adminController.getStat);
router.post("/unfreeze-account", verifyToken, adminController.unfreezeAccount);
router.post(
  "/update-loan-status/:loanId",
  verifyToken,
  adminController.updateLoanStatus
);
router.post("/get-all-loans", verifyToken, adminController.getAllLoansOfUsers);

module.exports = router;
