const express = require("express");
const atmCardValidation = require("../../validations/atmCardValidation");
const auth = require("../../utils/JwtService")
const router = express.Router()
const atmController = require("../controller/atmController")
const {verifyToken} = require("../../utils/JwtService")

router.post("/add-atm",atmCardValidation.addAtmValidation(),verifyToken,atmController.addAtm)
router.post("/get-atm/:id",atmCardValidation.atmIdValidation(),verifyToken,atmController.getAtmById)
router.post("/get-atms",verifyToken,atmController.getAllAtms)
router.post("/withdrawal/:id",atmCardValidation.atmIdValidation(),atmCardValidation.withdrawMoneyAtmValidation(),verifyToken,atmController.withdrwalAtmById)


module.exports = router