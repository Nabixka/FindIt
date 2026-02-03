const express = require("express")
const router = express.Router()
const userController = require("../controllers/UserController")
const auth = require("../middlewares/auth")

router.post("/", userController.createUser)
router.put("/", userController.forgetPassword)
router.post("/login", userController.loginUser)

router.get("/profil", auth, userController.getProfil)

router.get("/", userController.getUser)

router.get("/:id", auth, userController.getUserById)
router.delete("/:id", auth, userController.deleteUser )

module.exports = router