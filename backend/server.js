require("dotenv").config()
const express = require("express")
const app = express()
const bearerToken = require("express-bearer-token")
const cors = require('cors')
const port = process.env.PORT
const userRouter = require("./routers/UserRouter")

app.use(express.json())
app.use(bearerToken())
app.use(cors())
app.use("/user", userRouter)


app.listen(port, () => {
    console.log(`SERVER BERJALAN di http://localhost:${port}`)
})