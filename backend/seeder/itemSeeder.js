const pool = require("../database/db") 

async function itemSeeder(){
    try{
        const items = [
            {
                title: "Dompet",
                description: "Berwarna Coklat Merek Atlo",
                location: "Jalan Sudirman",
                image: `/uploads/dompet.jpg`,
                category: 'Pribadi',
                user_id: 1,
                status: 'lost'
            },
            {
                title: "Dompet",
                description: "Berwarna Coklat Merek Atlo",
                location: "Jalan Sudirman",
                image: `/uploads/dompet.jpg`,
                category: 'Pribadi',
                user_id: 2,
                status: 'found'
            }
        ]

        for(let item of items){
            await pool.query(`
                INSERT INTO items (title, description, location, image, category, user_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [item.title, item.description, item.location, item.image, item.category, item.user_id, item.status])
        }

        console.log("Berhasil Membuat Item")
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = itemSeeder