var spicedPg = require("spiced-pg");

if (!process.env.DATABASE_URL) {
    var secret = require("./secrets.json");
}

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${secret.dbUser}:${secret.dbPass}@localhost:5432/imageboard`
);

exports.getData = () => {
    return db.query(`SELECT url, title FROM images ORDER BY created_at DESC`);
};

exports.uploadData = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING url, title`,
        [url || null, title || null, description || null, username || null]
    );
};
