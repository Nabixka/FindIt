const pool = require("./database/postgres")

async function deleteDB(){
    try{
        await pool.query(`
            DROP DATABASE findit
        `)

        console.log("Berhasil Menghapus Database")
    }
    catch(err){
        console.log(err)
    }
}

deleteDB()