require("dotenv").config({path: "./config.env"})

//npm packages
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const PORT = process.env.PORT

// routers
const indexRouter = require('./routers/index')
const userRouter = require('./routers/users')
const compliancesRouter = require('./routers/compliances')
const standardsRouter = require('./routers/standards')
const productsRouter = require('./routers/products')

//ejs setting
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

//Data parasing
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//connect to MongoDB by mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser:true
})
const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('connected to Mongoose'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });
  

//connect router
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/compliances', compliancesRouter)
app.use('/standards', standardsRouter)
app.use('/products', productsRouter)

//set the listen port and show the successful connect information
app.listen(process.env.PORT, console.log(`Server is starting at ${PORT}`));