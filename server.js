require("dotenv").config({path: "./config.env"})

//npm packages
const express = require('express')
const app = express()
const PORT = process.env.PORT

const compliancesRouter = require('./routers/compliances')


//connect to MongoDB by mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser:true
})
const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('connected to Mongoose'))


//Data parasing
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//connect router
app.use('/', compliancesRouter)

//set the listen port and show the successful connect information
app.listen(process.env.PORT, console.log(`Server is starting at ${PORT}`));