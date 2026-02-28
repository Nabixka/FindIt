const user = require("../models/UserModel")
const pool = require("../database/db")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const { sendOTP, generateOTP } = require("../utils/otp")

// Kirim Kode OTP
exports.sendOtpCode = async (req, res) => {
    try{
        const { email } = req.body
        if(!email){
            return res.status(400).json({
                status: 400,
                message: "Email Wajib Diisi"
            })
        }

        const exist = await user.getUserByEmail(email)
        if(!exist){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        const otp = generateOTP()
        const expired = Date.now() + 5 * 60 * 1000

        await pool.query(`
            UPDATE users SET otp_code = $1, otp_expired = $2 WHERE email = $3`,
        [otp, expired, email])

        await sendOTP(email, otp)

        res.json({
            message: "Kode OTP Berhasil dikirim"
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

// Verifikasi Kode OTP
exports.verifyOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

        const result =  await user.getUserByEmail(email)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        if(!result.otp_code || Date.now() > result.otp_expired){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Kadaluarsa"
            })
        }

        if(otp !== result.otp_code){
            return res.status(400).json({
                status: 400,
                message: "Kote OTP Tidak Sesuai"
            })
        }

        await pool.query(`
            UPDATE users SET otp_code = NULL, otp_expired = NULL, is_verified = true WHERE email = $1`,
        [email])

        res.status(200).json({
            status: 200,
            message: "Kode OTP Benar"
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
        const { username, email, password, role } = req.body
        if(!username || !email || !password || !role){
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

        const result = await user.createUser({username, email, password, role})

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

// Forgot Password
exports.forgetPassword = async (req, res) => {
    try{
        const { email, otp, password} = req.body
        
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

        if(otp != exist.otp_code){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Tidak Sesuai"
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

        const otp = generateOTP()
        const expired = Date.now() + 5 * 60 * 1000

        await pool.query(`
            UPDATE users SET otp_code = $1, otp_expired = $2 WHERE email = $3`,
        [otp, expired, email])
        
        await sendOTP(email, otp)

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

exports.verifyLoginOtp = async (req, res) => {
    try{
        const { email, otp } = req.body

        const result = await user.getUserByEmail(email)
        if(!result){
            return res.status(404).json({
                status: 404,
                message: "Email Tidak Terdaftar"
            })
        }

        if(otp != result.otp_code){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Tidak Sesuai"
            })
        }

        if(Date.now() > result.otp_expired){
            return res.status(400).json({
                status: 400,
                message: "Kode OTP Sudah Kadaluarsa"
            })
        }

        const token = crypto.randomBytes(32).toString("hex")

        await pool.query(`
            UPDATE users SET token = $1, otp_code = NULL, otp_expired = NULL WHERE email = $2`,
        [token, email])

        const data = await user.getUserById(result.id)

        res.status(200).json({
            status: 200,
            message: "Login Berhasil",
            data: data
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

exports.getProfil = async (req, res) => {
    try{
        res.status(200).json({
            status: 200,
            message: "success",
            data: req.user
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
