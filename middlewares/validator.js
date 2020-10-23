const { check } = require('express-validator'),
    creds = require("../config/keys");
const { findUser, findUserByEmail } = require('../actions/db_actions_users');

module.exports = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email!')
        .custom(async email => {
            const user = await findUserByEmail(email);
            if (user[0]?.email)
                throw new Error('Email already Exists');
        }),
    requireUsername: check('username')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be a valid username!')
        .custom(async username => {
            const user = await findUser(username);
            if (user[0]?.username)
                throw new Error('Username already Exists');
        }),
    requireUsernameExists: check('username')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be a valid username!')
        .custom(async username => {
            const user = await findUser(username);
            if (!user[0]?.hasOwnProperty('username'))
                throw new Error('Username does not Exists');
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be a valid password!'),
    requirePasswordConfirmation: check('password_repeat')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Passwords!')
        .custom(async (password_repeat, { req }) => {
            if (password_repeat !== req.body.password)
                throw new Error('Passwords dont match!');
        }),
    requireAdminCode: check('admin_code')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Must be a valid admin code!')
        .custom(async admin_code => {
            if (admin_code !== creds.admin_code)
                throw new Error('Admin code is not correct!');
        })
}