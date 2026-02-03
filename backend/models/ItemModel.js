const pool = require("../database/db")

const getItem = async () => {
    const result = await pool.query(`
        SELECT * FROM items
    `)

    return result.rows
}

const getItemById = async (id) => {
    const result = await pool.query(`
        SELECT * FROM items WHERE id = $1`,
    [id])

    return result.rows[0]
}

module.exports = {
    getItem,
    getItemById
}