const express = require("express");
const userValidation = require("../../validations/userValidation");
const auth = require("../../utils/JwtService")
const router = express.Router()
const userController = require("../controller/userController")
const {verifyToken} = require("../../utils/JwtService")

router.post("/register",userValidation.registerValidation(),userController.registerUser)
router.post("/login",userValidation.loginValidation(),userController.loginUser)
router.post("/verify-otp",userController.verifyOtp)
router.post("/forgot-password",userController.forgotPassword)
router.post("/reset-password",userController.resetPassword)
router.post("/resend-otp",userController.resendOtp)
router.post("/get-profile",verifyToken,userController.profileUser)
router.post("/update-profile",verifyToken,userController.updateUser)

module.exports = router
