const pool = require("./database/postgres")

async function deleteDB(){
    try{
        await pool.query(`
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = 'findit'
            AND pid <> pg_backend_pid();
        `)
        await pool.query(`
            DROP DATABASE findit
        `)

        console.log("Berhasil Menghapus Database")
    }
    catch(err){
        console.log(err)
    }
    finally{
        process.exit(0)
    }
}

deleteDB()