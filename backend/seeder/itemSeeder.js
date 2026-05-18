const pool = require("../database/db")

async function itemSeeder() {
    try {
        const items = [
            {
                title: "Kunci Motor Honda",
                description: "Gantungan kunci bentuk astronot warna biru, ditemukan di parkiran.",
                location: "Jalan Sudirman",
                image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=500",
                category: "Lainnya",
                user_id: 2,
                status: "found",
                event_date: "2026-05-10"
            },
            {
                title: "iPhone 13 Pro",
                description: "Warna Sierra Blue, casing bening, hilang di sekitar halte.",
                location: "Masjid SMK Negeri 10 Jakarta",
                image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=500",
                category: "Elektronik",
                user_id: 3,
                status: "lost",
                event_date: "2026-05-12"
            },
            {
                title: "Kartu Mahasiswa (KTM)",
                description: "Atas nama Rizky Ramadhan, ditemukan di kantin.",
                location: "Jalan SMA 14",
                image: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=500",
                category: "Lainnya",
                user_id: 4,
                status: "found",
                event_date: "2026-05-11"
            },
            {
                title: "Tas Ransel Hitam",
                description: "Merek Eiger, berisi buku-buku pelajaran dan botol minum.",
                location: "PGC",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500",
                category: "Pribadi",
                user_id: 6,
                status: "lost",
                event_date: "2026-05-09"
            },
            {
                title: "Kacamata Frame Hitam",
                description: "Ditemukan di bangku taman, lensa terlihat silinder.",
                location: "Bandara Halim",
                image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=500",
                category: "Pribadi",
                user_id: 7,
                status: "found",
                event_date: "2026-05-13"
            },
            {
                title: "Earbuds TWS Soundcore",
                description: "Warna putih, hanya sebelah kanan yang ada di dalam case.",
                location: "Perpustakaan Daerah",
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500",
                category: "Elektronik",
                user_id: 8,
                status: "lost",
                event_date: "2026-05-08"
            },
            {
                title: "Dompet Kulit Pria",
                description: "Warna hitam, tidak ada uang tunai, hanya kartu identitas.",
                location: "Ancol",
                image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500",
                category: "Pribadi",
                user_id: 9,
                status: "found",
                event_date: "2026-05-10"
            },
            {
                title: "Tumblr Corkcicle",
                description: "Warna Rose Gold, ada stiker kucing di bagian bawah.",
                location: "Kuningan",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQppaKjAtEcsyHzt-9NNLeFgtabepXtjY96nQ&s",
                category: "Lainnya",
                user_id: 10,
                status: "lost",
                event_date: "2026-05-12"
            },
            {
                title: "Powerbank Anker",
                description: "Ditemukan di meja pojok kafe, kapasitas 10000mAh.",
                location: "Istana Presiden",
                image: "https://www.ankerindonesia.com/cdn/shop/files/A1259_Anker_Nano_Power_Bank_30W_Built-In_USB-C_Cable_Black_1_3.jpg?v=1724826528",
                category: "Elektronik",
                user_id: 11,
                status: "found",
                event_date: "2026-05-13"
            },
            {
                title: "Payung Lipat Biru",
                description: "Ketinggalan di gerbong kereta arah Bekasi.",
                location: "Monas",
                image: "https://cdn.ruparupa.io/fit-in/400x400/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10499647_1.jpg",
                category: "Pribadi",
                user_id: 12,
                status: "lost",
                event_date: "2026-05-11"
            },
            {
                title: "Kunci Motor",
                description: "Ganci bentuk astronot warna biru",
                location: "Jalan Sudirman",
                image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=500",
                category: "Lainnya",
                user_id: 12,
                status: "lost",
                event_date: "2026-05-10"
            },
        ];

        for (let item of items) {
            await pool.query(`
                INSERT INTO items (title, description, location, image, category, user_id, status, event_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [item.title, item.description, item.location, item.image, item.category, item.user_id, item.status, item.event_date])
        }

        console.log("Berhasil Membuat Item")
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports = itemSeeder