// app middleware
const fs = require('fs');

function studentLoggedMiddleware(req,res,next){

    if(req.session.studentLogged){
        res.locals.isLogged = true
        res.locals.studentLogged = req.session.studentLogged
    }

    return next()
}
module.exports=studentLoggedMiddleware
