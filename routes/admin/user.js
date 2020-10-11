module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    isModerator: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'moderator') {
            return next();
        }
        res.redirect('/login');
    }
}