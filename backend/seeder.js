const userSeeder = require("./seeder/userSeeder")
const itemSeeder = require("./seeder/itemSeeder")

async function seeder(){
    try{
        await userSeeder()
        await itemSeeder()
    }
    catch(err){
        console.log(err)
    }
    finally{
        process.exit(0)
    }
}

seeder()