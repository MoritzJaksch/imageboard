var spicedPg = require("spiced-pg");

if (!process.env.DATABASE_URL) {
    var secret = require("./secrets.json");
}

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${secret.dbUser}:${secret.dbPass}@localhost:5432/imageboard`
);

exports.getData = () => {
    return db.query(`SELECT * FROM images ORDER BY created_at DESC LIMIT 10`);
};
exports.getMoreImages = lastId => {
    return db
        .query(
            `SELECT *
           FROM images
        WHERE id < $1
        ORDER BY created_at desc
        LIMIT 9`,
            [lastId]
        )
        .then(results => {
            return results.rows;
        });
};

exports.uploadData = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING id, url, title`,
        [url || null, title || null, description || null, username || null]
    );
};

exports.getPicture = id => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            WHERE id > $1
            LIMIT 1
        ) AS next_id, (
            SELECT id FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 1
        ) AS prev_id
        FROM images
        WHERE id = $1`,
        [id || null]
    );
};
exports.postingComment = (img_id, comment, username) => {
    return db.query(
        `INSERT INTO comments (img_id, comment, username) VALUES ($1, $2, $3) RETURNING *`,
        [img_id || null, comment || null, username || null]
    );
};

exports.getComments = id => {
    return db.query(
        `SELECT comment, username FROM comments WHERE img_id = $1`,
        [id || null]
    );
};
