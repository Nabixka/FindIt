const pool = require("./db")

async function createTable(){
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR,
            email VARCHAR UNIQUE,
            token TEXT,
            password TEXT
            )       
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS barang(
            id SERIAL PRIMARY KEY,
            title VARCHAR,
            description TEXT, 
            location TEXT,
            image TEXT,
            user_found_id INT,
            status VARCHAR,

            FOREIGN KEY (user_found_id) REFERENCES users(id)
            )  
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat_room(
            id SERIAL PRIMARY KEY,
            user_found INT,
            user_owner INT,
            barang_id INT,

            FOREIGN KEY (user_found) REFERENCES users(id),
            FOREIGN KEY (user_owner) REFERENCES users(id),
            FOREIGN KEY (barang_id) REFERENCES barang(id)
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS chat(
            id SERIAL PRIMARY KEY,
            user_id INT,
            chat_room_id INT,
            message TEXT,

            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (chat_room_id) REFERENCES chat_room(id)
            )
        `)

        console.log("Berhasil Membuat Table")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = createTable