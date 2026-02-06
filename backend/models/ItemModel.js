const pool = require("../database/db")

// Get All Item  Lost
const getItem = async () => {
    const result = await pool.query(`
        SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.image,
        i.status,
        json_build_object(
        'id', u.id,
        'username', u.username) AS user

        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
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

// Create Item
const createItem =  async (data) => {
    const { title, description, image, location, user_id, status } = data
    
    const create = await pool.query(`
        INSERT INTO items (title, description, location, image, user_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `,[title, description, location, image, user_id, status])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT * FROM items WHERE id = $1`,
    [newId])

    return result.rows[0]
}

const getItemLost = async () => {
    const result = await pool.query(`
        SELECT * FROM items WHERE status = 'lost' `)

    return result.rows
}

const getItemFound = async () => {
    const result = await pool.query(`
        SELECT * FROM items WHERE status = 'found' `)

    return result.rows
}

const getItemUserLost = async (id) => {
    const result = await pool.query(`
        SELECT * FROM items WHERE user_id = $1 AND status = 'lost' `,
    [id])
    
    return result.rows
}

const getItemUserFound = async (id) => {
    const result  = await pool.query(`
        SELECT * FROM items WHERE user_id = $1 AND status = 'found' `,
    [id])

    return result.rows
}

module.exports = {
    getItem,
    getItemById,
    createItem,
    getItemLost,
    getItemFound,
    getItemUserLost,
    getItemUserFound
}