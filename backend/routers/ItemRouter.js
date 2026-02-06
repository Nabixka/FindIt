const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/ItemController")
const auth = require("../middlewares/auth")
const { upload } = require("../multer")

router.get("/", auth, ItemController.getItem)
router.post("/", auth, upload.single("image"), ItemController.createItem)
router.get("/found", auth, ItemController.getItemFound)
router.get("/lost", auth, ItemController.getItemLost)
router.get("/user/found", auth, ItemController.getItemUserFound)
router.get("/user/lost", auth, ItemController.getItemUserLost)
router.get("/:id", auth, ItemController.getItemById)

module.exports = router