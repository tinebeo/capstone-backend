require("dotenv").config({ path: "./config/config.env" })

// npm packages
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT
const passport = require('passport')

// file upload
const Grid = require('gridfs-stream');

// routers
const indexRouter = require('./routers/index')
const usersRouter = require('./routers/users')
const companiesRouter = require('./routers/companies')
const compliancesRouter = require('./routers/compliances')
const docusignsRouter = require('./routers/docusigns')
const standardsRouter = require('./routers/standards')
const productsRouter = require('./routers/products')
const RFQsRouter = require('./routers/RFQs')
const filesRouter = require('./routers/files')

// middlewares
const verifyJWT = require('./permission/verifyJWT')
const credentials = require('./permission/credentials')
const corsOptions = require('./config/corsOptions')
const cookieParser = require('cookie-parser')


app.use(passport.initialize());
require('./config/passport')(passport)
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())



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
app.use('/', indexRouter);
app.use('/users', usersRouter);

//app.use(verifyJWT);
app.use('/companies', companiesRouter);
app.use('/compliances', compliancesRouter);
app.use('/docusigns', docusignsRouter);
app.use('/standards', standardsRouter);
app.use('/products', productsRouter);
app.use('/RFQs', RFQsRouter);
app.use('/files', (req, res, next) => {
    req.gfs = gfs
    req.gridfsBucket = gridfsBucket
    next()
}, filesRouter);

//set the listen port and show the successful connect information
app.listen(process.env.PORT, console.log(`Server is starting at ${PORT}`));