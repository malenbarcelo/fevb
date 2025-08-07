
const df = require("./datesFuntions")
const typesCategoriesClassesQueries = require("../dbQueries/professionalLicences/typesCategoriesClassesQueries.js")
const commissionsQueries = require("../dbQueries/professionalLicences/commissionsQueries.js")
const scheduleQueries = require("../dbQueries/professionalLicences/scheduleQueries.js")

async function getSchedule(sessionData) {

    // get selection
    const selection = []
    sessionData.types.forEach(t => {
        const categories = sessionData.selection.filter(c => c.id_types == t.id)
        const mapCategories = categories.map( c => c.category).join(', ')
        selection.push({
            type: t.type,
            categories: mapCategories
        })
    })

    // get weeks to show
    let options = df.weeksToShow()

    options.forEach(o => {
        o.options = [],
        o.ciu = false
        
    })

    // get classes to assist
    const typesCategories = sessionData.selection.map(s => `${s.id_types}_${s.id_categories}`)
    const classesData = await typesCategoriesClassesQueries.get({filters:{}})

    // filter classes
    const classesFiltered = classesData.filter(c =>
        typesCategories.includes(`${c.id_types}_${c.id_categories}`)
    )

    const fe = classesFiltered.filter(c => c.id_courses == 2)
    const maxFe = Math.max(...fe.map(item => item.id_classes))
    const ciu = classesFiltered.filter(c => c.id_courses == 1)

    // get fe commissions
    let filters = {id_classes:maxFe, enabled:1}
    const feCommissions = await commissionsQueries.get({filters})
    const mapFeCommissions = feCommissions.map( fe => fe.id)

    // get schedule data
    for (let i = 0; i < options.length; i++) {
        for (let j = 0; j < mapFeCommissions.length; j++) {
            const filters = {
                enabled:1,
                id_commissions: mapFeCommissions[j],
                year: options[i].year,
                week_number: options[i].week_number
            }

            const dateOption = await scheduleQueries.get({filters})

            options[i].options.push(dateOption)
        }
    }

    // add ciu
    if (ciu.length > 0) {
        options.forEach(o => o.ciu = true)
    }

    for (let i = 0; i < options.length; i++) {
        
        const filters = {
            enabled:1,
            id_commissions: 9,
            year: options[i].year,
            week_number: options[i].week_number
        }

        const dateOption = await scheduleQueries.get({filters})

        options[i].ciu_date = dateOption
        
    }

    // define options
    let flatOptions = []
    let id = 1
    options.forEach(o => {
        o.options.forEach(oo => {
            flatOptions.push({
                id:id,
                option:oo,
                week_number: oo[0].week_number,
                commission_name: oo[0].commission_name,
                commission_number: oo[0].commission_number,
                year: o.year,
                start_day: oo[0].day_number,
                start_date: oo[0].day + ' ' + oo[0].date_string,
                ciu: o.ciu,
                ciu_date: o.ciu_date,
                ciu_description: o.ciu_date.map(d => d.description).join(' Y ')

            })
            id += 1                    
        })
    })

    // add description
    flatOptions.forEach(o => {
        const descriptions = o.option.map(opt => opt.description)
        o.description = descriptions.join(' Y ')
    })

    // delete commission 2 if CIU
    if (ciu.length > 0) {
        flatOptions = flatOptions.filter( o => o.start_day != 4)                
    }

    return {flatOptions, selection}
}

module.exports = { getSchedule }