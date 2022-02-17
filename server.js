require("dotenv").config({ path: "./config/config.env" })

//npm packages
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const cors = require('cors')
const PORT = process.env.PORT

// file upload
const Grid = require('gridfs-stream');

//passport
const passport = require('passport')

//routers
const indexRouter = require('./routers/index')
const userRouter = require('./routers/users')
const compliancesRouter = require('./routers/compliances')
const standardsRouter = require('./routers/standards')
const productsRouter = require('./routers/products')
const filesRouter = require('./routers/files')

//ejs setting
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use(passport.initialize());
require('./config/passport')(passport)

app.use(cors())

//Data parasing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//connect to MongoDB by mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
})
const db = mongoose.connection

let gfs;
let gridfsBucket;
db.on('error', err => console.error(err))
db.once('open', () => {
    console.log('connected to Mongoose')
    gridfsBucket = new mongoose.mongo.GridFSBucket(db.db, {
        bucketName: 'uploads'
    })
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads');
})

//connect router
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/compliances', compliancesRouter)
app.use('/standards', standardsRouter)
app.use('/products', productsRouter)
app.use('/files', (req, res, next) => {
    req.gfs = gfs
    req.gridfsBucket = gridfsBucket
    next()
}, filesRouter)

app.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//set the listen port and show the successful connect information
app.listen(process.env.PORT, console.log(`Server is starting at ${PORT}`));