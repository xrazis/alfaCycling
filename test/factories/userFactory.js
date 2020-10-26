const db = require('../../connections/db_conn'),
    crypto = require('crypto');


module.exports = async () => {
    const id = crypto.randomBytes(4).toString("hex");

    const sql = 'INSERT INTO users (id) values (?)';

    await db.query(sql, id);

    return id;
}