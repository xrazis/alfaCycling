const db = require('../../config/dbConn'),
    crypto = require('crypto');

module.exports = {
    insertUser: async (username, hash) => {
        const id = crypto.randomBytes(4).toString("hex");

        const newUser = [id, username, hash, 'moderator']
        const sql = 'INSERT INTO users (id, username, password, role ) values (?, ?, ?, ?)';

        await db.query(sql, newUser);

        return;
    },
    findUser: async (username) => {
        const sql = 'SELECT * FROM users WHERE username = ?';

        const user = await db.query(sql, username);

        return user;
    },
    findUserById: async (id) => {
        const sql = 'SELECT * FROM users WHERE id = ?';

        const user = await db.query(sql, id);

        return user;
    },
    findUserByEmail: async (email) => {
        const sql = 'SELECT * FROM users WHERE email = ?';

        const user = await db.query(sql, email);

        return user;
    },
    insertUserEmail: async (req) => {
        const { email, username } = req.body;

        const sql = 'UPDATE users SET email = ? WHERE username = ?;';

        await db.query(sql, [email, username]);

        return;
    },
    showAllUsersFromDatabase: async () => {
        const sql = 'SELECT * FROM users;';

        const users = await db.query(sql);

        return users;
    }
};