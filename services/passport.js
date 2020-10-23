const bcrypt = require('bcrypt'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

const { insertUser, findUser, findUserById } = require('../actions/db_actions_users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id)
        if (!user) {
            return done(new Error('user not found'));
        }
        done(null, user[0]);
    } catch (e) {
        done(e);
    }
});

passport.use('register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, done) => {
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            console.log(err);
        } else {
            try {
                await insertUser(username, hash);
            } catch (error) {
                const errors = [{ value: 'Exists', msg: 'Error in Register!!', param: 'password', location: 'passport' }];
                return done(null, false, errors);
            };
            const user = await findUser(username);
            return done(null, user[0]);
        };
    });
}));

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    const user = await findUser(username);

    bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) throw err;
        if (result) {
            return done(null, user[0]);
        } else {
            const errors = [{ value: 'Exists', msg: 'Wrong Password!', param: 'password', location: 'passport' }];
            return done(null, false, errors);
        }
    })
}));

module.exports = passport;