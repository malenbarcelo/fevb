// app middleware
const fs = require('fs');

function selectedCompanyMiddleware(req,res,next){

    if(req.session.company){
        res.locals.company = true
        res.locals.company = req.session.company
    }

    return next()
}
module.exports=selectedCompanyMiddleware
