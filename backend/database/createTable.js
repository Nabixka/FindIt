let pool

if(process.env.MODE == "dev"){
    pool = require("./db")
}else{
    pool = require("./postgres")
}

async function createTable(){
    try{
        await pool.query(`
            CREATE TYPE item_category AS ENUM(
            'Elektronik', 
            'Aksesoris', 
            'Pribadi', 
            'Berharga', 
            'Lainnya' 
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR,
            email VARCHAR UNIQUE,
            token TEXT,
            password TEXT,
            role VARCHAR,
            status VARCHAR,
            nomor VARCHAR,
            otp_code VARCHAR,
            otp_expired BIGINT,
            otp_verified BOOLEAN DEFAULT false
            )       
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS items(
            id SERIAL PRIMARY KEY,
            title VARCHAR,
            description TEXT, 
            location TEXT,
            image TEXT,
            category item_category,
            user_id INT,
            status VARCHAR,

            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )  
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS report(
            id SERIAL PRImARY KEY,
            report_user_id INT,
            user_id INT,
            item_id INT,
            proof TEXT,
            reason TEXT,

            FOREIGN KEY (report_user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
            )`)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS item_matches(
            id SERIAL PRIMARY KEY,
            item_id_1 INT NOT NULL,
            item_id_2 INT NOT NULL,
            similarity_score FLOAT,
            match_type VARCHAR,
            is_sent BOOLEAN DEFAULT false,
            sent_to_user_id INT,
            sent_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (item_id_1) REFERENCES items(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id_2) REFERENCES items(id) ON DELETE CASCADE,
            FOREIGN KEY (sent_to_user_id) REFERENCES users(id) ON DELETE SET NULL
            )`)

        console.log("Berhasil Membuat Table")
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = createTable