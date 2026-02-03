const pool = require("../database/db")

const auth = async (req, res, next) => {
    if(!req.token){
        return res.status(401).json({
            message: "Token Tidak Ada"
        })
    }

    const result = await pool.query(`
        SELECT id, username, email FROM users WHERE token = $1`,
    [req.token])

    if(result.rows.length === 0){
        return res.status(401).json({
            message: "Token Tidak Valid"
        })
    }

    req.user = result.rows[0]
    next()
}

module.exports = auth