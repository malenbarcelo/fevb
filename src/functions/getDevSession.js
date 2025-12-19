const sid = require('../data/sessionInscriptionsDev') // inscriptions session

function getDevSession(req,sessionToGet) {

    const url = req.get('host')

    // get session for dev    
    if (url.includes('localhost:') && !req.session.coursesData) {
        req.session.courseType = sid.courseType
        req.session.coursesData = sid.coursesData
        req.session.price = sid.price
        req.session.selectionSummary = sid.selectionSummary
        req.session.schedule = sid.schedule
        req.session.scheduleDescription = sid.scheduleDescription
        req.session.personalData = sid.personalData
        req.session.hasPractical = sid.hasPractical
        req.session.companyData = sid.companyData
        req.session.quantity = sid.quantity
        req.session.inscriptionType = sid.inscriptionType
    }
}

module.exports = { getDevSession }

