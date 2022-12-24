exports.getBlog = (req,res,next)=>{
    try{
        res.render('blog',{
            isLogin: req.isAuthenticated(),
            user: req.user
        })
    }catch(e){
        next(e)
    }
}