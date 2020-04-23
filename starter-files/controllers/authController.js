const passport = require('passport')


exports.login = passport.authenticate('local', {
    failureRedirect: '/login/',
    failureFlash: 'Failed Login',
    successRedirect: '/',
    successFlash: 'You are logged in!'
}) 

exports.logout = (req,res) => {
    req.logout()
    req.flash('success', "You are logged out! Byyyyeeee")
    res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next()
        return
    } req.flash('error', 'You must be logged in to add a store!')
    res.redirect('/login')
}