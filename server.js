require("dotenv").config({path: "./config.env"})

//npm packages
const express = require('express')
const app = express()
const PORT = process.env.PORT

// routers
const indexRouter = require('./routers/index')
const userRouter = require('./routers/users')
const compliancesRouter = require('./routers/compliances')
const standardsRouter = require('./routers/standards')


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
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/compliances', compliancesRouter)
app.use('/standards', standardsRouter)

//set the listen port and show the successful connect information
app.listen(process.env.PORT, console.log(`Server is starting at ${PORT}`));