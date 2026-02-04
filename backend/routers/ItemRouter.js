const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/ItemController")
const auth = require("../middlewares/auth")
const { upload } = require("../multer")

router.get("/", auth, ItemController.getItem)
router.get("/:id", auth, ItemController.getItemById)
router.post("/", auth, upload.single("image"), ItemController.createItem)

module.exports = router