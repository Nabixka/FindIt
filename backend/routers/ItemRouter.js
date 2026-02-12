const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/ItemController")
const auth = require("../middlewares/auth")
const { upload } = require("../multer")

// GetAll
router.get("/", auth, ItemController.getItem)

// Create Item
router.post("/", auth, upload.single("image"), ItemController.createItem)

// Get Item Found/Lost
router.get("/found", auth, ItemController.getItemFound)
router.get("/lost", auth, ItemController.getItemLost)

// Get Item User Found/Lost
router.get("/user/found", auth, ItemController.getItemUserFound)
router.get("/user/lost", auth, ItemController.getItemUserLost)

// Item By Id
router.get("/:id", auth, ItemController.getItemById)
router.delete("/:id", auth, ItemController.deleteItem)

module.exports = router