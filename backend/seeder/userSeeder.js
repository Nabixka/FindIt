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
                nomor: "6281234567890"
            },
            {
                username: "Budi Santoso",
                email: "budi.s@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281298765432"
            },
            {
                username: "Siti Aminah",
                email: "siti.aminah@yahoo.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281311223344"
            },
            {
                username: "Andi Wijaya",
                email: "andi.wijaya@outlook.com",
                status: "banned",
                password: "password123",
                role: "member",
                nomor: "6285644556677"
            },
            {
                username: "Rina Permata",
                email: "rina.p@gmail.com",
                status: "active",
                password: "password123",
                role: "admin",
                nomor: "6281900998877"
            },
            {
                username: "Dewi Lestari",
                email: "dewi.les@hotmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6282122334455"
            },
            {
                username: "Eko Prasetyo",
                email: "eko.pras@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281122336677"
            },
            {
                username: "Rizky Ramadhan",
                email: "rizky.rama@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281288776655"
            },
            {
                username: "Maya Indah",
                email: "maya.indah@yahoo.co.id",
                status: "banned",
                password: "password123",
                role: "member",
                nomor: "6281399887766"
            },
            {
                username: "Agus Setiawan",
                email: "agus.set@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6285711224455"
            },
            {
                username: "Lutfi Hakim",
                email: "lutfi.h@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281255667788"
            },
            {
                username: "Putri Rahayu",
                email: "putri.r@outlook.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281899001122"
            },
            {
                username: "Denny Hidayat",
                email: "denny.h@gmail.com",
                status: "active",
                password: "password123",
                role: "admin",
                nomor: "6281233445566"
            },
            {
                username: "Taufik Hidayat",
                email: "taufik.h@gmail.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6281377889900"
            },
            {
                username: "Anisa Fitri",
                email: "anisa.f@yahoo.com",
                status: "active",
                password: "password123",
                role: "member",
                nomor: "6285211335577"
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