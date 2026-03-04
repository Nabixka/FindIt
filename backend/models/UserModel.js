const pool = require("../database/db")
const bcrypt = require("bcrypt")

// Get User
const getUser = async () => {
    const result = await pool.query(`
        SELECT * FROM users
    `)

    return result.rows
}

// Get User ById
const getUserById = async (id) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`,
    [id])

    if(result.rows.length == 0){
        return null
    }

    const user =  result.rows[0]
    delete user.password
    return user
}

// Create Account
const createUser = async (data) => {
    const { username, email, password, role } = data
    const hashedPassword = await bcrypt.hash(password, 10)

    const create = await pool.query(`
        INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id
    `, [username, email, hashedPassword, role])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`,
    [newId])

    const user = result.rows[0]
    delete user.password
    return user
}

// Get By Email
const getUserByEmail = async (email) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email = $1`,
    [email])

    return result.rows[0]
}

// Forget Password
const forgetPassword = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const update = await pool.query(`
        UPDATE users SET password = $1 otp_code = NULL, otp_expired = NULL WHERE email = $2`,
    [hashedPassword, email])
}

// Delete Account
const deleteUser = async (id) => {
    const result = await pool.query(`
        DELETE FROM users WHERE id = $1`, 
    [id])
}

const getReport = async () => {
    const result = await pool.query(`
        SELECT 
        r.id,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,
        r.reason
        
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id`)

    return result.rows
}

const getReportById = async (id) => {
    const result = await pool.query(`
        SELECT 
        r.id,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,
        r.reason
        
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = $1`, [id])

    return result.rows[0]
}

const createReport = async (data) => {
    const { user_id, reason } = data

    const create = await pool.query(`
        INSERT INTO report (user_id, reason) VALUES ($1, $2) RETURNING id`,
    [user_id, reason])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT 
        r.id,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
        ) AS user,
        r.reason
        
        FROM report r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = $1`, [newId])
    
    return result.rows[0]
    
}

// Exports
module.exports = { 
    getUser,
    getUserById,
    createUser,
    forgetPassword,
    getUserByEmail,
    deleteUser,
    getReport,
    getReportById,
    createReport
}