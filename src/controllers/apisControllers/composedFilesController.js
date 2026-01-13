const readXlsxFile = require('read-excel-file/node')
const path = require('path')
const datesFunctions = require("../../utils/datesFuntions")
const studentsQueries = require("../../dbQueries/students/studentsQueries")
const {getDevSession} = require("../../utils/getDevSession")

const composedFilesController = {
    uploadPersonalDataList: async(req,res) =>{
        try{

            // body
            const data = {
                ...req.body,
                file: req.file.filename
            }

            // file path
            const filePath = path.resolve(process.cwd(), 'public/files/personalDataLists', data.file)

            // read file
            let rows = await readXlsxFile(filePath)
            rows = rows.slice(1)

            ////// find errors
            let errors = 0
            const errorsTexts = []

            // no empty fields
            const allFilled = rows.every(r =>
                r.every(value => value !== null)
            )
            errors += allFilled ? 0 : 1
            !allFilled && errorsTexts.push('Se detectaron campos incompletos')

            // find CUIT/CUIL in table
            const tableData = data.students.split(',').map( element => Number(element))
            const rowData = rows.map( r => r[2])
            const existingData = rowData.some(r => tableData.includes(r))
            errors += existingData ? 1 : 0
            existingData && errorsTexts.push('Hay CUIT/CUIT que ya se encuentan en la tabla de alumnos')

            // no duplicated CUIT/CUIL
            const hasDuplicatesCuitsCuils = new Set(rows.map(row => row[2])).size !== rows.length
            errors += hasDuplicatesCuitsCuils ? 1 : 0
            hasDuplicatesCuitsCuils && errorsTexts.push('Se detectaron CUIT/CUIL duplicados en el archivo')

            // invalid CUIT/CUIL
            const ivalidCuitCuil = rows.some(row =>
                !row[2] || !/^\d{11}$/.test(String(row[2]))
            )
            errors += ivalidCuitCuil ? 1 : 0
            ivalidCuitCuil && errorsTexts.push('El CUIT/CUIL debe ser numérico y debe tener 11 dígitos')

            // invalid phone number
            const invalidPhoneNumber = rows.some(row =>
                row[4] == null || !/^\d+$/.test(String(row[4]))
            )
            errors += invalidPhoneNumber ? 1 : 0
            invalidPhoneNumber && errorsTexts.push('El teléfono debe ser numérico')

            // email
            const invalidEmail = rows.some(row =>
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row[3] || ''))
            )
            errors += invalidEmail ? 1 : 0
            invalidEmail && errorsTexts.push('Se detectaron emails inválidos')

            // find already inscripted student            
            getDevSession(req,'sid') // get session if DEV
            const idCoursesTypes = req.session.coursesData[0].id_courses_types
            const weeksToFind = datesFunctions.getNweeks(12)
            const cuitsCuils = rows.map( r => r[2])
            let findStudent = await studentsQueries.get({undefined, undefined, filters:{cuit_cuil:cuitsCuils,year_week:weeksToFind,id_courses_types:[idCoursesTypes], enabled:1}})
            findStudent = findStudent.rows

            errors += findStudent.length > 0 ? 1 : 0

            findStudent.length > 0 && errorsTexts.push('Los siguientes CUIT/CUIL ya están inscriptos en el curso de ' + req.session.coursesData[0].course_name + ': ' + findStudent.map( s => s.cuit_cuil).join(', '))

            
            res.status(200).json({errors, errorsTexts, rows})

        }catch(error){
            console.log(error)
            res.status(200).json('error')
        }
    },
}
module.exports = composedFilesController

