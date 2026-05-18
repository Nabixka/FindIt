const pool = require("../database/db");

const createMatch = async (item_id_1, item_id_2, similarity_score, match_type) => {
    const result = await pool.query(`
        INSERT INTO item_matches (item_id_1, item_id_2, similarity_score, match_type)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
        RETURNING *
    `, [item_id_1, item_id_2, similarity_score, match_type]);
    return result.rows[0];
};

const getAllMatches = async () => {
    const result = await pool.query(`
        SELECT 
            m.*,
            i1.title as item1_title, i1.location as item1_location, i1.image as item1_image,
            i2.title as item2_title, i2.location as item2_location, i2.image as item2_image,
            u1.username as user1_name, u2.username as user2_name
        FROM item_matches m
        JOIN items i1 ON m.item_id_1 = i1.id
        JOIN items i2 ON m.item_id_2 = i2.id
        JOIN users u1 ON i1.user_id = u1.id
        JOIN users u2 ON i2.user_id = u2.id
        ORDER BY m.created_at DESC
    `);
    return result.rows;
};

const getUserMatches = async (user_id) => {
    const result = await pool.query(`
        SELECT 
            m.*, 
            i1.title as item1_title, i1.location as item1_location, i1.image as item1_image,
            i2.title as item2_title, i2.location as item2_location, i2.image as item2_image,
            u1.username as user1_name, u2.username as user2_name
        FROM item_matches m
        JOIN items i1 ON m.item_id_1 = i1.id
        JOIN items i2 ON m.item_id_2 = i2.id
        JOIN users u1 ON i1.user_id = u1.id
        JOIN users u2 ON i2.user_id = u2.id
        WHERE (i1.user_id = $1 OR i2.user_id = $1) AND m.is_sent = true
        ORDER BY m.sent_at DESC
    `, [user_id]);
    return result.rows;
};

const checkMatchExists = async (id1, id2) => {
    const result = await pool.query(`
        SELECT id FROM item_matches 
        WHERE (item_id_1 = $1 AND item_id_2 = $2) 
        OR (item_id_1 = $2 AND item_id_2 = $1)
    `, [id1, id2]);
    return result.rows.length > 0;
};

const markMatchAsSent = async (match_id, user_id) => {
    const result = await pool.query(`
        UPDATE item_matches
        SET is_sent = true, sent_to_user_id = $2, sent_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
    `, [match_id, user_id]);
    return result.rows[0];
};

const getMatchById = async (id) => {
    const result = await pool.query(`
        SELECT 
            m.*,
            i1.title as item1_title, i1.location as item1_location, i1.image as item1_image,
            i2.title as item2_title, i2.location as item2_location, i2.image as item2_image,
            u1.username as user1_name, u2.username as user2_name
        FROM item_matches m
        JOIN items i1 ON m.item_id_1 = i1.id
        JOIN items i2 ON m.item_id_2 = i2.id
        JOIN users u1 ON i1.user_id = u1.id
        JOIN users u2 ON i2.user_id = u2.id
        WHERE m.id = $1
    `, [id]);
    return result.rows[0];
};

module.exports = { createMatch, getAllMatches, getUserMatches, checkMatchExists, markMatchAsSent, getMatchById };