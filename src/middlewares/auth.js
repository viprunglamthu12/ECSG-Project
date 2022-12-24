const User = require('../models/user')

const auth = async(req,res,next)=>{
    if (req.isAuthenticated()) { 
        req.userInfo = await User.findOne({
            steamid: req.user.steamid,
        }).lean()
        return next(); }
    res.redirect('/');
}

const auth2 = async(req,res,next)=>{
    if (req.isAuthenticated()) { 
        req.userInfo = await User.findOne({
            steamid: req.user.steamid,
        })
        return next(); }
    res.send('You can not do this without Login')
}

module.exports = {
    auth,auth2
};