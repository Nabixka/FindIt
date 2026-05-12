const item = require("../models/ItemModel")
const user = require("../models/UserModel")
const cloudinary = require("../database/cloudinary")
const { scanNewItemForMatches } = require("./MatchController")

exports.getItem = async (req, res) => {
    try{
        const result = await item.getItem()
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getItemById = async (req, res) => {
    try{
        const { id } = req.params
        const result = await item.getItemById(id)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Not Found",
            })
        }

        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.createItem = async (req, res) => {
    try{
        const user_id = req.user.id
        const {title, location, category, description, status } = req.body
        
        let imageUrl = null
        if (req.file && req.file.buffer && req.file.buffer.length > 0) {
            try {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'items', public_id: `${Date.now()}_${req.file.originalname}` },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(req.file.buffer);
                });
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    status: 500,
                    message: "Upload failed",
                    error: uploadError.message
                });
            }
        }

        if(!title || !location || !category || !description){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const result = await item.createItem({title, description, image: imageUrl, category, location, user_id, status})
        
        // Scan untuk match dengan item lain
        setTimeout(async () => {
            await scanNewItemForMatches(result.id, 0.7)
        }, 100)

        res.status(201).json({
            status: 201,
            message: "created",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getItemUser = async (req, res) => {
    try{
        const id = req.user.id

        const exist = await user.getUserById(id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "User Tidak Ada"
            })
        }

        const result = await item.getItemUser(id)
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.deleteItem = async (req, res) => {
    try{
        const { id } = req.params

        const exist = await item.getItemById(id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Not Found"
            })
        }

        const result = await item.deleteItem(id)

        res.status(200).json({
            status: 200,
            message: "success"
        })
    }
    catch(err){
        res.status(500).json({
            status: 500,
            message: err.message,
            stack: err.stack
        })
    }
}