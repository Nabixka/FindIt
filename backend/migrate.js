const createDB = require("./database/createDB")
const createTable = require("./database/createTable")

async function migrate(){
    try{
        await createDB()
        await createTable()
    }
    catch(err){
        console.log(err)
    }
    finally{
        process.exit(0)
    }
}

migrate()