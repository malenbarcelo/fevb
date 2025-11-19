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

        const courseType = data.examData.courses_types_alias
        const exam = 'exam' + data.examData.id
        const version = 'version' + data.lastAnswer.exam_version
        const variant = 'variant' + data.lastAnswer.exam_variant            

        // get folder files
        const folder = path.join(__dirname, '../..', 'public/images/examsImages', courseType)
        const allFiles = await fs.readdir(folder)
        const examFiles = allFiles.filter( f => f.split('_')[0] == exam && f.split('_')[1] == version && f.split('_')[2] == variant )

        return {courseType, examFiles}

    },

}

module.exports = generalFunctions