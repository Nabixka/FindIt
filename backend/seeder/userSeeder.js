const pool = require("../database/db")
const bcrypt = require("bcrypt")

async function userSeeder() {
    try {
        const users = [
            {
                username: "Muhammad Fadhil",
                email: "fadhil@example.com",
                status: "active",
                password: "password123",
                role: "admin",
                nomor: "081234567890"
            },
            {
                username: "Budi Santoso",
                email: "budi.s@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081298765432"
            },
            {
                username: "Siti Aminah",
                email: "siti.aminah@yahoo.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081311223344"
            },
            {
                username: "Andi Wijaya",
                email: "andi.wijaya@outlook.com",
                status: "banned",
                password: "password123",
                role: "member",
                nomor: "085644556677"
            },
            {
                username: "Rina Permata",
                email: "rina.p@gmail.com",
                status: "active",
                password: "password123",
                role: "admin",
                nomor: "081900998877"
            },
            {
                username: "Dewi Lestari",
                email: "dewi.les@hotmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "082122334455"
            },
            {
                username: "Eko Prasetyo",
                email: "eko.pras@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081122336677"
            },
            {
                username: "Rizky Ramadhan",
                email: "rizky.rama@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081288776655"
            },
            {
                username: "Maya Indah",
                email: "maya.indah@yahoo.co.id",
                status: "banned",
                password: "password123",
                role: "member",
                nomor: "081399887766"
            },
            {
                username: "Agus Setiawan",
                email: "agus.set@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "085711224455"
            },
            {
                username: "Lutfi Hakim",
                email: "lutfi.h@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081255667788"
            },
            {
                username: "Putri Rahayu",
                email: "putri.r@outlook.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081899001122"
            },
            {
                username: "Denny Hidayat",
                email: "denny.h@gmail.com",
                status: "active",
                password: "password123",
                role: "admin",
                nomor: "081233445566"
            },
            {
                username: "Taufik Hidayat",
                email: "taufik.h@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "081377889900"
            },
            {
                username: "Anisa Fitri",
                email: "anisa.f@yahoo.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "085211335577"
            }
        ];

        for (let user of users) {
            const hash = await bcrypt.hash(user.password, 10)

            await pool.query(`
                INSERT INTO users (username, email, password, role, status, nomor) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
                [user.username, user.email, hash, user.role, user.status, user.nomor])
        }

        console.log("Berhasil Membuat User")
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports = userSeeder