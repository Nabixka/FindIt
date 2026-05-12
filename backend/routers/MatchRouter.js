const express = require("express")
const router = express.Router()
const MatchController = require("../controllers/MatchController")
const auth = require("../middlewares/auth")
const cekRole = require("../middlewares/cekRole")

// Get semua matches (admin only)
router.get("/", auth, cekRole, MatchController.getAllMatches)

// Get user matches
router.get("/user/list", auth, MatchController.getUserMatches)

// Get detail match (admin)
router.get("/:id", auth, cekRole, MatchController.getMatchDetail)

// Kirim match ke user (admin only)
router.post("/send", auth, cekRole, MatchController.sendMatchToUser)

// Scan untuk membuat matches
router.post("/scan", auth, cekRole, MatchController.scanForMatches)

module.exports = router
