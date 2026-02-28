const express = require("express")
const router = express.Router()
const userController = require("../controllers/UserController")
const auth = require("../middlewares/auth")
const cekRole = require("../middlewares/cekRole")

// Auth

// Register
router.post("/register", userController.createUser)

// OTP
router.post("/otp/send", userController.sendOtpCode)
router.post("/otp/verify", userController.verifyOtp)

// Login
router.post("/login", userController.loginUser)
router.post("/login/verify", userController.verifyLoginOtp)

// Forgot Password
router.post("/forgot/otp", userController.sendOtpCode)
router.put("/forgot/password", userController.forgetPassword)

// Profil
router.get("/profil", auth, userController.getProfil)

// Get All User
router.get("/", userController.getUser)

// Get And Delete ById
router.get("/:id", auth, userController.getUserById)
router.delete("/:id", auth, cekRole, userController.deleteUser )

module.exports = router