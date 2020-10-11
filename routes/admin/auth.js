const express = require('express'),
    router = express.Router(),
    passport = require('passport');

const { handleErrors, handleErrorsPassport } = require('./middlewares');
const { insertUserEmail } = require('./dbActions');
const { getError } = require('../../views/admin/helper.js');
const { requireEmail, requireUsername, requireUsernameExists, requirePassword, requirePasswordConfirmation, requireAdminCode } = require('./validator');

router.get('/auth/register', (req, res) => {
    res.render('admin/register', {
        error: getError(req.session.errors)
    });
});

router.post('/auth/register',
    [requireUsername, requireEmail, requirePassword, requirePasswordConfirmation, requireAdminCode],
    handleErrors('register'),
    (req, res, next) => {
        passport.authenticate('register', async (err, user, info) => {
            if (err)
                console.log(chalk.red(error));
            if (info)
                handleErrorsPassport(req, res, 'register', info);
            if (user) {
                req.logIn(user, async () => {
                    await insertUserEmail(req);
                    res.redirect('/admin-panel');
                });
            }
        })(req, res, next);
    });

router.get('/auth/login', (req, res) => {
    res.render('admin/login', {
        error: getError(req.session.errors)
    });
});

router.post('/auth/login',
    [requireUsernameExists],
    handleErrors('login'),
    (req, res, next) => {
        passport.authenticate('login', (err, user, info) => {
            if (err)
                console.log(chalk.red(error));
            if (info)
                handleErrorsPassport(req, res, 'login', info);
            if (user) {
                req.logIn(user, () => {
                    res.redirect('/admin-panel');
                })
            }
        })(req, res, next);
    });

router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/index');
});

module.exports = router;
