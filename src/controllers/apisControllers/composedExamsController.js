const examsPracticalsQuestionsQueries = require("../../dbQueries/exams/examsPracticalsQuestionsQueries")
const gf = require("../../utils/generalFunctions")
const getStudentsCoursesExams = require("../../utils/studentsCoursesExamsUtils")
const excelJs = require('exceljs')

const examsController = {
    
    getExamAction: async(req,res) =>{
        try{

            const action = req.session.studentLogged.action

            res.status(200).json(action)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

    downloadRepre: async(req,res) =>{
        try{

            const filters = {
                repre: 'enabled',
                enabled: 1,
                order: [["id","DESC"]]
            }

            // get data
            const data = await getStudentsCoursesExams({undefined,undefined,filters})

            const dataToPrint = data.rows
    
            const workbook = new excelJs.Workbook()
        
            const worksheet = workbook.addWorksheet('REPRE')
      
            const columns = [
                { header: 'Documento', key: 'dni', width: 15, style: {alignment:{horizontal: 'center'}} },
                { header: 'Codigo escuela', key: 'school_code', width: 15, style: {alignment:{horizontal: 'center'}}},
                { header: 'Codigo Tipo Curso', key: 'course_code', width: 18, style: {alignment:{horizontal: 'center'}}},
                { header: 'Estado', key: 'status', width: 10, style: {alignment:{horizontal: 'center'}}},
                { header: 'Fecha inicio', key: 'start_date', width: 15, style: {alignment:{horizontal: 'center'}}},
                { header: 'Vencimiento', key: 'expiration', width: 15, style: {alignment:{horizontal: 'center'}}},
                { header: 'Fecha finalización', key: 'end_date', width: 18, style: {alignment:{horizontal: 'center'}}},
                { header: 'Clase', key: 'class', width: 10, style: {alignment:{horizontal: 'center'}}}
            ]
      
            worksheet.columns = columns

            dataToPrint.forEach(element => {

                const startDateElement = element.student_data.attendance.reduce((min, current) => 
                    current.id < min.id ? current : min
                )

                // start date
                const startDateStr = startDateElement.date_string + '/' + startDateElement.year
                const [day1, month1, year1] = startDateStr.split('/')
                const startDate = new Date(year1, month1 - 1, day1)

                // end date
                const practicalDateArray = element.exams_results.practical_date == null ? null : element.exams_results.practical_date.split('-')
                const endDateStr = element.exams_results.practical_date == null ? (element.student_data.attendance[0].date_string + '/' + element.student_data.attendance[0].year) : String((Number(practicalDateArray[2]) + '/' + Number(practicalDateArray[1]) + '/' + Number(practicalDateArray[0])))
                const [day2, month2, year2] = endDateStr.split('/')
                const endDate = new Date(year2, month2 - 1, day2)

                const year3 = Number(year2) + 2

                const expirationDate = new Date(year3, month2 - 1, day2)
                
                const rowData = {
                    'dni': Number(String(element.student_data.cuit_cuil).slice(2, -1)),
                    'school_code': element.course_data.repre_school_code,
                    'course_code': element.course_data.repre_course_code,
                    'status':'A',
                    'start_date': startDate,
                    'expiration': expirationDate,
                    'end_date': endDate,
                    'class': element.course_data.repre_class,
                }
        
                worksheet.addRow(rowData)
                
            })

            // get ids
            const ids = dataToPrint.map( d => d.id)
      
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.setHeader('Content-Disposition', 'attachment; filename=Envío ' + Math.floor(Date.now() / 1000) + '.xlsx')
            res.setHeader('X-Downloaded-Ids', JSON.stringify(ids))
            
            await workbook.xlsx.write(res)
            
            res.end()
          
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = examsController

