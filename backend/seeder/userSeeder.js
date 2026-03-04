const pool = require("../database/db")
const bcrypt = require("bcrypt")

async function userSeeder(){
    try{
        const users = [
            {
                username: "User 1",
                email: "user1@gmail.com",
                password: "admin123",
                role: "member"
            },
            {
                username: "User 2",
                email: "user2@gmail.com",
                password: "admin123",
                role: "member"
            },
            {
                username: "Admin 1",
                email: "admin1@gmail.com",
                password: "admin123",
                role: "admin"
            }
        ]

        const reports = [
            {
                user_id: 1,
                reason: "Baldjadkjakjdakjdjakdjkdl"
            }
        ]

        for(let user of users){
            const hash = await bcrypt.hash(user.password, 10)

            await pool.query(`
                INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
            [user.username, user.email, hash, user.role])
        }

        for(let report of reports){
            await pool.query(`
                INSERT INTO report (user_id, reason) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [report.user_id, report.reason])
        }

        console.log("Berhasil Membuat User")
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = userSeeder