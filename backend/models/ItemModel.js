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
        i.category,
        i.status,
        i.event_date,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'nomor', u.nomor
        ) AS user

        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
    `)

    return result.rows
}

// Get Item Lost ById
const getItemById = async (id) => {
    const result = await pool.query(`
        SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.image,
        i.category,
        i.status,
        i.event_date,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'nomor', u.nomor
        ) AS user

        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        WHERE i.id = $1`,
    [id])

    return result.rows[0]
}

// Create Item
const createItem =  async (data) => {
    const { title, description, image, location, category, user_id, status, event_date } = data
    
    const create = await pool.query(`
        INSERT INTO items (title, description, location, category, image, user_id, status, event_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `,[title, description, location, category, image, user_id, status, event_date])

    const newId = create.rows[0].id
    const result = await pool.query(`
        SELECT 
        i.id,
        i.title,
        i.description,
        i.location,
        i.category,
        i.image,
        i.status,
        i.event_date,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'nomor', u.nomor
        ) AS user

        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        WHERE i.id = $1`,
    [newId])

    return result.rows[0]
}

// Get All User Item
const getItemUser = async (id) => {
    const result = await pool.query(`
        SELECT 
        i.id,
        i.title,
        i.description,
        i.category,
        i.image,
        i.location,
        i.status,
        i.event_date,
        json_build_object(
        'id', u.id,
        'username', u.username,
        'nomor', u.nomor
        ) AS User

        FROM items i
        LEFT JOIN users u ON i.user_id = u.id
        WHERE i.user_id = $1
        `,
    [id])

    return result.rows
}


// Delete Item
const deleteItem = async (id) => {
    const result = await pool.query(`
        DELETE FROM items WHERE id = $1`
    ,[id])
}

// Delete User Item
const deleteItemUser = async (id) => {
    const result = await pool.query(`
        DELETE FROM items WHERE user_id = $1`,
    [id])
}

module.exports = {
    getItem,
    getItemById,
    createItem,
    getItemUser,
    deleteItem,
    deleteItemUser
}