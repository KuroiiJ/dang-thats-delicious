const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')


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

exports.forgot = async (req, res) => {
   const user = await User.findOne({ email: req.body.email })
   if(!user) {
       req.flash('error', 'A password reset has been mailed to you')
       return res.redirect('/login')
   }

   user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
   user.resetPasswordExpires = Date.now() + 3600000
   await user.save()

   const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`
   req.flash('sucess', `You have been emailed a password reset link. ${resetURL}`)
   res.redirect('/login')
}

exports.reset = async (req, res) => {
    const user = User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    })
    if(!user) {
        req.flash('error', 'Password reset token is expired or invalid')
        return res.redirect('/login')
    }
    res.render('reset', { title: 'Reset your Password' })
}