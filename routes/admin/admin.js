const express = require('express'),
    router = express.Router();

const { showAllFromDatabase } = require('../../actions/db_actions_blogs');
const { showAllUsersFromDatabase } = require('../../actions/db_actions_users');
const { requireAuth } = require('../../middlewares/middlewares');

router.get('/admin-panel', requireAuth, async (req, res) => {
    res.render('admin/admin-panel', {
        blogs: await showAllFromDatabase(),
        users: await showAllUsersFromDatabase()
    });
});

module.exports = router;
