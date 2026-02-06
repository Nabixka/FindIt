const item = require("../models/ItemModel")
const user = require("../models/UserModel")

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
        const {title, location, description, status } = req.body
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null

        if(!title || !location || !description){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const result = await item.createItem({title, description, image: imageUrl, location, user_id, status})
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

exports.getItemLost = async (req, res) => {
    try{

        const result = await item.getItemLost()
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

exports.getItemFound = async (req, res) => {
    try{

        const result = await item.getItemFound()
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

exports.getItemUserLost = async (req, res) => {
    try{
        const user_id  = req.user.id 

        const exist = await user.getUserById(user_id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Not Found"
            })
        }

        const result = await item.getItemUserLost(user_id)
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

exports.getItemUserFound = async (req, res) => {
    try{
        const user_id = req.user.id 

        const exist = await user.getUser(user_id)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Not Found"
            })
        }

        const result = await item.getItemUserFound(user_id)
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