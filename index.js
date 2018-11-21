const express = require("express");
const app = express();

const ca = require("chalk-animation");

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

const { getData, uploadData } = require("./db");

app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        console.log("req.file: ", req.file);
        console.log("req.body: ", req.body);
        uploadData(
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        ).then(data => {
            console.log(data);
            res.json(data);
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.get("/get-images", (req, res) => {
    getData().then(images => {
        res.json(images.rows);
    });
});

app.listen(8080, () => ca.rainbow("Big Brother is listening"));
