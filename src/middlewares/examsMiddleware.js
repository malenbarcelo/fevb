// route middleware
function examsMiddleware(req,res,next){
    if(!req.session.studentLogged){
        return res.redirect('/examenes')
    }
    return next()
}
module.exports=examsMiddleware
