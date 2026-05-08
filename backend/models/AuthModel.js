const pool = require("../database/db")
const bcrypt = require("bcrypt")

// Create Account
const createUser = async (data) => {
    const { username, email, password, role, nomor } = data
    const hashedPassword = await bcrypt.hash(password, 10)
    const status = "active"

    const create = await pool.query(`
        INSERT INTO users (username, email, password, role, status, nomor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `, [username, email, hashedPassword, role, status, nomor])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1`,
    [newId])

    const user = result.rows[0]
    delete user.password
    return user
}

// Forget Password
const forgetPassword = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const update = await pool.query(`
        UPDATE users SET password = $1 WHERE email = $2`,
    [hashedPassword, email])
}

module.exports = {
    createUser,
    forgetPassword
}