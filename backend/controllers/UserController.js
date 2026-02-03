const user = require("../models/UserModel")
const pool = require("../database/db")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

// Get User
exports.getUser = async (req, res) => {
    try{
        const result = await user.getUser()
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

// Get User ById
exports.getUserById = async (req, res) => {
    try{
        const { id } = req.params
        const result = await user.getUserById(id)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Not Found"
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

// Create User
exports.createUser = async (req, res) => {
    try{
        const { username, email, password } = req.body
        if(!username || !email || !password){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(exist){
            return res.status(409).json({
                status: 409,
                message: "Email Sudah Ada"
            })
        }

        const result = await user.createUser({username, email, password})
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

// Delete User
exports.deleteUser = async (req, res) => {
    try{
        const { id } = req.params
        
        const result = await user.deleteUser(id)
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

// Forgot Password
exports.forgetPassword = async (req, res) => {
    try{
        const { email, password} = req.body
        
        if(!email || !password){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "User Tidak Ada"
            })
        }

        const result = await user.forgetPassword(email, password)
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

// Login
exports.loginUser = async (req, res) => {
    try{

        const { email, password } = req.body
        
        if(!email || !password){
            return res.status(400).json({
                status: 400,
                message: "Bad Request"
            })
        }
        
        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }
        
        const matchPassword = await bcrypt.compare(password, exist.password)
        if(!matchPassword){
            return res.status(400).json({
                status: 400,
                message: "Password Salah"
            })
        }
        
        const token = crypto.randomBytes(32).toString("hex")

        await pool.query(`
            UPDATE users SET token = $1 WHERE id = $2`,
        [token, exist.id])
        
        const result = await user.getUserById(exist.id)
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