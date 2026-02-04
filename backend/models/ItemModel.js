const pool = require("../database/db")

// Get All Item  Lost
const getItem = async () => {
    const result = await pool.query(`
        SELECT * FROM items
    `)

    return result.rows
}

// Get Item Lost ById
const getItemById = async (id) => {
    const result = await pool.query(`
        SELECT * FROM items WHERE id = $1`,
    [id])

    return result.rows[0]
}

const createItem =  async (data) => {
    const { title, description, image, location, user_found_id } = data
    
    const create = await pool.query(`
        INSERT INTO items (title, description, location, image, user_found_id) VALUES ($1, $2, $3, $4, $5) RETURNING id
    `,[title, description, location, image, user_found_id])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT * FROM items WHERE id = $1`,
    [newId])

    return result.rows[0]
}

module.exports = {
    getItem,
    getItemById,
    createItem
}