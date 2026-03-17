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


                
                const startDate = (element.exams_results.practical_date == null || new Date(element.exams_results.practical_date) < new Date(element.exams_results.theorical_date)) ? new Date(element.exams_results.theorical_date) : new Date(element.exams_results.practical_date)
                const startDateYear = startDate.getFullYear()
                const startDateMonth = startDate.getMonth()
                const startDateDay = startDate.getDate()
                const startDateString = startDateDay + '/' + startDateMonth + '/' + startDateYear
                const expiration = startDateDay + '/' + startDateMonth + '/' + (startDateYear + 2)
                const endDate = (startDateDay + 2) + '/' + startDateMonth + '/' + startDateYear
                
                const rowData = {
                    'dni': Number(String(element.student_data.cuit_cuil).slice(2, -1)),
                    'school_code': element.course_data.repre_school_code,
                    'course_code': element.course_data.repre_course_code,
                    'status':'A',
                    'start_date': startDateString,
                    'expiration': expiration,
                    'end_date': endDate,
                    'class': element.course_data.repre_class,
                }
        
                worksheet.addRow(rowData)
                
            }) 
      
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          res.setHeader('Content-Disposition', 'attachment; filename=Envío ' + Math.floor(Date.now() / 1000) + '.xlsx')
        
          await workbook.xlsx.write(res)
          
          res.end()
          
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = examsController

