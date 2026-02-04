const item = require("../models/ItemModel")

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
        const {title, location, description, } = req.body
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

        if(!title || !location || !description){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const result = await item.createItem({title, description, image: imageUrl, location, user_found_id: user_id})
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