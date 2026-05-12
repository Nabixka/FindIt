const pool = require("../database/db")
const bcrypt = require("bcrypt")

async function userSeeder(){
    try{
        const users = [
            {
                username: "Muhammad Fadhil",
                email: "user1@gmail.com",
                status: "active",
                password: "admin123",
                role: "member",
                nomor: "08111111111"
            },
            {
                username: "User 2",
                email: "user2@gmail.com",
                status: "banned",
                password: "admin123",
                role: "member",
                nomor: "08111111111"
            },
            {
                username: "Admin 1",
                email: "admin1@gmail.com",
                password: "admin123",
                status: "active",
                role: "admin",
                nomor: "08111111111"
            }
        ]

        for(let user of users){
            const hash = await bcrypt.hash(user.password, 10)

            await pool.query(`
                INSERT INTO users (username, email, password, role, status, nomor) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
            [user.username, user.email, hash, user.role, user.status, user.nomor])
        }

        console.log("Berhasil Membuat User")
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = userSeeder