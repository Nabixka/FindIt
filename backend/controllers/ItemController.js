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