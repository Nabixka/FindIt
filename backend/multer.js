const multer = require("multer")

const storage = multer.memoryStorage()

const uploadItems = multer({
    storage
})

const uploadReport = multer({
    storage
})

module.exports = { uploadItems, uploadReport }