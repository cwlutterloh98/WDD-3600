// module checks if user is logged in if not it sends to login page
module.exports = (req,res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}