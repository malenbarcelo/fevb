
const { getSchedule } = require("../../functions/getSchedule")
const ce = require("../../functions/createExcel")
const studentsQueries = require("../../dbQueries/professionalLicences/studentsQueries")
const datesQueries = require("../../dbQueries/professionalLicences/datesQueries")
const excelJs = require('exceljs')

const plController = {
    getSchedule: async(req,res) =>{
        try{

            const data = await getSchedule(req.session)

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    downloadAttendanceList: async(req,res) =>{
        try{

            const data = req.body
            
            let filters = {
                week_number: parseInt(data.week_number),
                year: parseInt(data.year),
                day_number: 2
            }
            
            const datesData = await datesQueries.get({filters})

            // create excel and sheets
            const workbook = new excelJs.Workbook()
            const worksheet1 = workbook.addWorksheet('Comisión 1')
            const worksheet2 = workbook.addWorksheet('Comisión 2')
            
            // add title
            worksheet1.getCell('B2').value = 'SEMANA ' + data.week_number + ' - ' + 'Lunes ' + datesData[0].date_string + '/' + data.year + ' (Comisión 1)'
            worksheet1.getCell('B2').font = { size: 14, bold: true }
            worksheet1.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' }

            worksheet2.getCell('B2').value = 'SEMANA ' + data.week_number + ' - ' + 'Lunes ' + datesData[0].date_string + '/' + data.year + ' (Comisión 2)'
            worksheet2.getCell('B2').font = { size: 14, bold: true }
            worksheet2.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' }

            // add main table heders
            ce.addMainTableHeaders(worksheet1,1)
            ce.addMainTableHeaders(worksheet2,2)

            // add secondary table titles
            const headersWs1 = ['CUIT', 'Nombre y Apellido', 'Email', 'Teléfono', 'Inscripción','LM', 'LT', 'MM', 'MT','XM', 'XT']
            const headersWs2 = headers = ['CUIT', 'Nombre y Apellido', 'Email', 'Teléfono', 'Inscripción','XM', 'XT', 'JM','JT','--', '--']
            ce.addSecondaryTableHeaders(worksheet1,headersWs1,2,5)
            ce.addSecondaryTableHeaders(worksheet2,headersWs2,2,5)

            // change columns width
            ce.columnWidth(worksheet1)
            ce.columnWidth(worksheet2)

            // get rows data
            filters = {
                week_number:data.week_number,
                year:data.year,
                commission_number:1
            }
            const studentsCom1 = await studentsQueries.get({filters})

            filters = {
                week_number:data.week_number,
                year:data.year,
                commission_number:2
            }
            const studentsCom2 = await studentsQueries.get({filters})

            // add data to sheets
            ce.addRowsData(worksheet1, studentsCom1,6,2)
            ce.addRowsData(worksheet2, studentsCom2,6,2)
      
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          res.setHeader('Content-Disposition', 'attachment; filename=Semana.xlsx')
        
        await workbook.xlsx.write(res)
          
        res.end()
          
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    getSession: async(req,res) =>{
        try{

            const data = req.session

            res.status(200).json(data)

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = plController

