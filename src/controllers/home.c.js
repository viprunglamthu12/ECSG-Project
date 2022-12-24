


exports.getHome = async (req,res,next) => {
    try{
        res.render('home',{
            isLogin: req.isAuthenticated(),
            user: req.user,
            info: req.userInfo
        })
    }catch(err){
        next(err)
    }
};