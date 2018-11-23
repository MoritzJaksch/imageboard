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
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const {
    getData,
    uploadData,
    getPicture,
    postingComment,
    getComments,
    getMoreImages
} = require("./db");

app.use(express.static("./public"));
app.use(express.static("./uploads"));

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        uploadData(
            config.s3Url + req.file.filename,
            req.body.title,
            req.body.description,
            req.body.username
        ).then(data => {
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

app.get("/get-more-images/:id/", (req, res) => {
    var lastId = req.params.id;
    getMoreImages(lastId).then(images => {
        console.log("images in get more Images: ", images);
        res.json(images);
    });
});

app.get("/get-modal", (req, res) => {
    Promise.all([getPicture(req.query.id), getComments(req.query.id)]).then(
        picture => {
            res.json(picture);
        }
    );
});

app.post("/comment", (req, res) => {
    postingComment(req.body.id, req.body.comment, req.body.user).then(
        comments => {
            res.json(comments);
        }
    );
});

app.listen(8080, () => ca.rainbow("Big Brother is listening"));
