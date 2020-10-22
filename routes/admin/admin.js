const express = require('express'),
    router = express.Router();

const { showAllFromDatabase } = require('../blogs/dbActions');
const { showAllUsersFromDatabase } = require('./dbActions');
const { requireAuth } = require('./middlewares');

router.get('/admin-panel', requireAuth, async (req, res) => {
    res.render('admin/admin-panel', {
        blogs: await showAllFromDatabase(),
        users: await showAllUsersFromDatabase()
    });
});

module.exports = router;
