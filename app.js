import "dotenv/config"
import express from "express"
import pool from "./databases/db.js"
import tasks from "./routes/tasksRoutes.js"
import users from "./routes/usersRoutes.js"
import auth from "./routes/authRoutes.js"
import cookieParser from "cookie-parser"

const app = express()
const Port = process.env.PORT || 3000   

app.use(express.json())
app.use(cookieParser())
app.use('/tasks', tasks)
app.use('/users', users)
app.use('/auth', auth)

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the website" })
})

app.listen(Port, () => {
    console.log(`Server running on ${Port}`)
})