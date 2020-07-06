var db = require("../config/db_conn"),
    bcrypt = require('bcryptjs'),
    LocalStrategy = require("passport-local").Strategy,
    saltRounds = 10;

const creds = require("../config/creds");

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        var sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, id, function (err, user) {
            done(err, user[0]);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            db.query("select * from users where username = '" + username + "'",
                function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('registerMessage', 'That username is already taken.'));
                    } else {
                        var newUser = new Object();

                        var email = req.body.email;
                        var cPassword = req.body.password;
                        var cPassword_repeat = req.body.password_repeat;
                        var admin_code = req.body.admin_code;

                        if (cPassword === cPassword_repeat && admin_code === creds.admin_code) {
                            bcrypt.hash(password, saltRounds, function (err, hash) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    newUser.email = email;
                                    newUser.username = username;
                                    newUser.password = hash;
                                    newUser.role = "moderator";

                                    var insertQuery = "INSERT INTO users ( email, username, password, role ) values ('" + email + "','" + username +
                                        "','" + hash + "','moderator')";
                                    console.log(insertQuery);
                                    db.query(insertQuery, function (err, rows) {
                                        newUser.id = rows.insertId;
                                        return done(null, newUser);
                                    });
                                }
                            });
                        } else {
                            return done(null, false, req.flash('registerMessage', 'Wrong password or Admin code!'));
                        }
                    }
                });
        }));

    passport.use(
        "local-login",
        new LocalStrategy({
                passReqToCallback: true
            },
            function (req, username, password, done) {
                var sql = "SELECT * FROM users WHERE username = ?";
                db.query(sql, username, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user.length) {
                        return done(null, false, req.flash('loginMessage', 'No such user!'));
                    }
                    bcrypt.compare(password, user[0].password, function (err, result) {

                        if (err) {
                            return done(null, false, req.flash('loginMessage', 'Decryption Error!'));
                        } else if (result) {
                            return done(null, user[0]);
                        } else {
                            return done(null, false, req.flash('loginMessage', 'Incorrect password!'));
                        }
                    })
                });
            })
    );
};