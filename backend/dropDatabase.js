const pool = require("./database/postgres")

async function deleteDB() {
    try {
        await pool.query(`DROP DATABASE IF EXISTS findit WITH (FORCE);`);

        console.log("Berhasil Menghapus Database 'findit'");
    } catch (err) {
        console.error("Gagal menghapus database:", err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

deleteDB()