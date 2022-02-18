// S3
/*const express = require('express')
const router = express.Router()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuidv4()}-${originalname}`) // TODO add timestamp instead of uuid
    }
})
const upload = multer({ storage })

const { uploadFile, getFileStream } = require("../middleware/s3")


// files/upload/:key
router.get('/upload/:key', (req, res) => {
    const key = req.params.key
    const readStream = getFileStream(key)

    readStream.pipe(res)

})


// files/upload
// upload.array for multiple uplaods
router.post('/upload', upload.single('file'), async (req, res, next) => {
    const file = req.file
    console.log(file)
    //const result = await uploadFile(file)
    
    //res.send({filePath: `/upload/${result.key}`})
})


module.exports = router
*/

require("dotenv").config({ path: "./config/config.env" })
const express = require('express')
const router = express.Router()
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const methodOverride = require('method-override');



const storage = new GridFsStorage({
    url: process.env.DATABASE_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// @route POST /upload
// @desc  Uploads file to DB
router.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
    //res.redirect('/');
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/:filename', (req, res) => {
    req.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        // File exists
        console.log(file)
        const readstream = req.gridfsBucket.openDownloadStream(file._id);
        //console.log(readstream)
        readstream.pipe(res)
        //return res.json(file);
        
    });
});



module.exports = router