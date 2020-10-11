const express = require('express'),
    router = express.Router();

const { showAllFromDatabase } = require('../blogs/dbActions');
const { requireAuth } = require('./middlewares');

router.get('/admin-panel', requireAuth, async (req, res) => {
    const blogs = await showAllFromDatabase();

    res.render('admin/admin-panel', {
        blogs: blogs
    });
});

module.exports = router;
