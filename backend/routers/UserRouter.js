const express = require("express")
const router = express.Router()
const userController = require("../controllers/UserController")

router.get("/", userController.getUser)
router.get("/:id", userController.getUserById)
router.post("/", userController.createUser)
router.put("/:id", userController.forgetPassword)
router.post("/login", userController.loginUser)
router.delete("/:id", userController.deleteUser )

module.exports = router