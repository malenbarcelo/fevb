const fs = require('fs').promises
const path = require('path')

const generalFunctions = {

    compareArrays: (array1, array2) => {

        const setA = new Set(array1)
        const setB = new Set(array2)

        if (setA.size !== setB.size) return false

        for (const elem of setA) {
            if (!setB.has(elem)) return false
        }

        return true

    },

    getExamImages: async(req) => {

        const data = req.session.studentLogged
        const courseType = data.studentExam.exam_theorical_data.courses_types_alias
        const exam = 'exam' + data.studentExam.exam_theorical_data.id
        const version = 'version' + data.lastAnswer.exam_theorical_version
        const variant = 'variant' + data.lastAnswer.exam_theorical_variant            

        // get folder files
        const folder = path.join(__dirname, '../..', 'public/images/examsImages', courseType)
        const allFiles = await fs.readdir(folder)
        const examFiles = allFiles.filter( f => f.split('_')[0] == exam && f.split('_')[1] == version && f.split('_')[2] == variant )

        return {courseType, examFiles}

    },

    specialChars: (value) => {
        if (typeof value !== 'string') return value // Solo procesa si es string
        return value.replace(/[%_]/g, char => `\\${char}`)
    },

    randomString: (length) => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        const numbers = '0123456789'
        const specials = '!?-$%&'

        const allChars = upper + lower + numbers + specials

        let result = ''
  
        // mandatory
        result += upper.charAt(Math.floor(Math.random() * upper.length))
        result += lower.charAt(Math.floor(Math.random() * lower.length))
        result += specials.charAt(Math.floor(Math.random() * specials.length))

        // rest random
        for (let i = 3; i < length; i++) {
            result += allChars.charAt(Math.floor(Math.random() * allChars.length))
        }

        // mix
        result = result
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('')

        return result
    },



}

module.exports = generalFunctions