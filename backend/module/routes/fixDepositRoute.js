const express = require("express");
const fixDepositValidation = require("../../validations/fixDepositValidation");
const router = express.Router()
const fixDepositController = require("../controller/fixDepositController")
const {verifyToken} = require("../../utils/JwtService")

router.post("/add-FD",fixDepositValidation.addFDValidation(),verifyToken,fixDepositController.addFD)
router.post("/get-all-FD",verifyToken,fixDepositController.getAllFD)
router.post("/get-FD/:id",fixDepositValidation.FDIdValidation(),verifyToken,fixDepositController.getFDById)
router.post("/claim-FD/:id",fixDepositValidation.FDIdValidation(),verifyToken,fixDepositController.claimFDById)



module.exports = router