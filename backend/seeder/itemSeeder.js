const pool = require("../database/db") 

async function itemSeeder(){
    try{
        const items = [
            {
                title: "Dompet",
                description: "Berwarna Coklat Merek Atlo",
                location: "Jalan Sudirman",
                image: `${process.env.API_URL}/uploads/dompet.jpg`,
                user_found_id: 1
            }
        ]

        for(let item of items){
            await pool.query(`
                INSERT INTO items (title, description, location, image, user_found_id) VALUES ($1, $2, $3, $4, $5)`,
            [item.title, item.description, item.location, item.image, item.user_found_id])
        }

        console.log("Berhasil Membuat Item")
    }
    catch(err){
        console.log(err)
    }
}

module.exports = itemSeeder