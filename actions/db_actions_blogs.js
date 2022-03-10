const db = require('../connections/db_conn'),
    crypto = require('crypto');

module.exports = {
    insertToDatabase: async (req) => {
        const {title, subtitle, body} = req.body;
        const {username} = req.user;
        const image = req.file.path.replace(/public/, '');
        const id = crypto.randomBytes(4).toString('hex');

        const newBlog = [id, title, subtitle, image, body, username, username];
        const sql = 'INSERT INTO blogs (id,title,subtitle,image,body,posted_by,edited_by) VALUES (?, ?, ?, ?, ?, ?, ?);';

        await db.query(sql, newBlog);

        return id;
    },
    updateDatabase: async (req) => {
        const {title, subtitle, body} = req.body;
        const {username} = req.user;
        const id = req.params.id;
        const image = req.file.path.replace(/public/, '');
        const edited = new Date();

        const updateBlog = [title, subtitle, image, body, edited, username, id];
        const sql = 'UPDATE blogs SET title = ?, subtitle=?, image = ?, body = ?, edited = ?, edited_by = ? WHERE id = ?;';

        await db.query(sql, updateBlog);

        return;
    },
    deleteFromDatabase: async (id) => {
        const sql = 'DELETE FROM blogs WHERE id = ?;';

        await db.query(sql, id);

        return;
    },
    showAllFromDatabase: async (limit = 50) => {
        const sql = 'SELECT * FROM blogs ORDER BY created DESC LIMIT ?;';

        const blogs = await db.query(sql, limit);

        return blogs;
    },
    getOneFromDatabase: async (id) => {
        const sql = 'SELECT * FROM blogs WHERE blogs.id = ?;';

        const foundBlog = await db.query(sql, id);

        return foundBlog;
    }
};
