const pool = require("../database/db")
const bcrypt = require("bcrypt")

async function userSeeder(){
    try{
        const users = [
            {
                username: "User 1",
                email: "user1@gmail.com",
                password: "admin123"
            },
            {
                username: "User 2",
                email: "user2@gmail.com",
                password: "admin123"
            }
        ]

        for(let user of users){
            const hash = await bcrypt.hash(user.password, 10)

            await pool.query(`
                INSERT INTO users (username, email, password) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
            [user.username, user.email, hash])
        }

        console.log("Berhasil Membuat User")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = userSeeder