function getInscription(courses) {
    
    const groups = {}

    courses.forEach(course => {
        if (!groups[course.type_alias]) {
            groups[course.type_alias] = []
        }

        groups[course.type_alias].push(course.category)
    })

    const inscription = Object.entries(groups)
        .map(([type, categories]) => `${type}: ${categories.join(', ')}`)
        .join(' | ')
        
    return inscription
}

module.exports = {
    getInscription
}