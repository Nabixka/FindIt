const express = require("express")
const router = express.Router()
const ItemController = require("../controllers/ItemController")
const auth = require("../middlewares/auth")

router.get("/", auth, ItemController.getItem)
router.get("/:id", auth, ItemController.getItemById)

module.exports = router