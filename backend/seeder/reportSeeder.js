const pool = require("../database/db")


async function reportSeeder() {
    try {
        const reports = [
            {
                report_user_id: 2,
                user_id: 3,
                item_id: 2,
                proof: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=500",
                reason: "User ini terindikasi melakukan penipuan. Meminta biaya tebusan yang tidak masuk akal untuk pengembalian HP."
            },
            {
                report_user_id: 4,
                user_id: 6,
                item_id: 4,
                proof: "https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=500",
                reason: "Foto barang yang diunggah tidak pantas dan mengandung unsur sensitif/spam."
            },
            {
                report_user_id: 7,
                user_id: 8,
                item_id: 6,
                proof: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=500",
                reason: "Kata-kata di deskripsi barang sangat kasar dan menghina kelompok tertentu."
            },
            {
                report_user_id: 9,
                user_id: 10,
                item_id: 8,
                proof: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500",
                reason: "Double posting. User ini mengunggah barang yang sama berkali-kali sehingga memenuhi halaman utama (spam)."
            },
            {
                report_user_id: 11,
                user_id: 12,
                item_id: 10,
                proof: "https://images.unsplash.com/photo-1525598912003-663126343e1f?q=80&w=500",
                reason: "Nomor WhatsApp yang dicantumkan ternyata link phising atau penipuan saat dihubungi."
            }
        ];

        for (let report of reports) {
            await pool.query(`
            INSERT INTO report (report_user_id, user_id, item_id, proof, reason) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
                [report.report_user_id, report.user_id, report.item_id, report.proof, report.reason])
        }

        console.log("Berhasil Membuat Report")
    }
    catch (err) {
        console.log("Gagal Membuat Report ", err)
    }
}

module.exports = reportSeeder