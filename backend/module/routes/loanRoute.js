const express = require("express");
const router = express.Router();
const loanController = require("../controller/loanController");
const { verifyToken } = require("../../utils/JwtService");

router.post("/apply-loan", verifyToken, loanController.applyLoan);
router.post("/get-loans", verifyToken, loanController.getLoans);
router.post("/pay-emi/:loanId", verifyToken, loanController.payEmi);
router.delete("/delete-loan/:loanId", verifyToken, loanController.deleteLoan);
router.post("/get-all-loans", verifyToken, loanController.getAllLoans);

module.exports = router;
