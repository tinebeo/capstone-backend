require("dotenv").config({path: "./config.env"})

//npm packages
const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send("Inside Home")
})

app.listen(process.env.PORT)