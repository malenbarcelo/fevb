const { google } = require('googleapis')
const credentials = require('../data/googleSheetsCredentials.json')
const dateQueries = require("../dbQueries/courses/datesQueries")
const typesQueries = require("../dbQueries/courses/typesQueries")


async function postData(dataToPost,spreadsheetId) {

    try {

        const sheets = await getSheets()
        const range = 'inscriptos!A2'

        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED', 
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: dataToPost }
        })
            
    } catch (error) {
        console.error('Error al enviar datos:', error)
    }
}

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: (credentials.private_key || '').replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })

  const client = await auth.getClient()
  
  return google.sheets({ version: 'v4', auth: client })
}

async function getDataToPost(createdData,sessionData) {

    let course = ''
    const datasToPost = []
    if (sessionData.courseType.alias == 'LP') {
        course = sessionData.selectionSummary
                .map(d => `${d.typeAlias}: ${d.categories.join(', ')}`)
                .join(' | ')
            
    }else{
        course = (sessionData.courseType.alias + ': ') + (sessionData.coursesData[0].category == sessionData.courseType.alias ? sessionData.coursesData[0].type_alias : sessionData.coursesData[0].category)
    }

    // get sheet name
    const monday = await dateQueries.get({filters:{weeks_numbers:[createdData.week_number],years:[createdData.year],days_numbers:[1]}})
    const date = `${monday[0].date_string}/${monday[0].year}`
    const dateString = `'${date}`
    const sheet = `'Lunes ${date} - ${sessionData.courseType.alias}`
    const dateNumber = Number(date.split('/')[2] + date.split('/')[1] + date.split('/')[0])
    
    const dataToPost = [
        createdData.id,
        sessionData.personalData[0].cuit_cuil,
        sessionData.personalData[0].first_name.toUpperCase() + ' ' + sessionData.personalData[0].last_name.toUpperCase(),
        sessionData.personalData[0].email,
        sessionData.personalData[0].phone_number,
        createdData.year,
        createdData.week_number,
        createdData.year_week,
        createdData.price,
        sessionData.courseType.alias,
        course,
        sheet,
        dateString,
        dateNumber,
        sessionData.schedule.shifts.find( s => s.day_shift == 'LM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'LT') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'MM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'MT') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'XM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'XT') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'JM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'JT') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'VM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'VT') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'SM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'ST') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'DM') ? 1 : 0,
        sessionData.schedule.shifts.find( s => s.day_shift == 'DT') ? 1 : 0,
        sessionData.coursesData.find(cd=> cd.alias == 'C1_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C2_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C3_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D1_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D2_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D3_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E1_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E2_obtencion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C1_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C2_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C3_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D1_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D2_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D3_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E1_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E2_ampliacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C1_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C2_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'C3_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D1_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D2_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'D3_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E1_renovacion') ? 'si' : 'no',
        sessionData.coursesData.find(cd=> cd.alias == 'E2_renovacion') ? 'si' : 'no',
    ]

    datasToPost.push(dataToPost)

    return datasToPost
}

async function getInscriptionsData() {

    try {

        const spreadsheetId = '1PwmOCrSuWzZ5S7gWnBlx6fxW1plcCRkUhBuroQhOJzg'
        const range = 'alumnos!A2:H'

        const sheets = await getSheets()
        
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        })

        const rows = res.data.values || []

        return rows
            
    } catch (error) {
        console.error('Error al enviar datos:', error)
    }
}

async function getBulkInscriptionsData(spreadsheetId) {

    try {

        //const spreadsheetId = '1PwmOCrSuWzZ5S7gWnBlx6fxW1plcCRkUhBuroQhOJzg'
        const range = 'inscribir!A2:DJ'

        const sheets = await getSheets()
        
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        })

        let rows = res.data.values || []

        rows = rows.filter( r => r[0] != '')

        return rows
            
    } catch (error) {
        console.error('Error al enviar datos:', error)
    }
}

async function getBulkDataToPost(students, data, dates) {

    let dataToPost = []
    const coursesTypes = await typesQueries.get({filters:{}})
    

    students.forEach((student,i) => {

        // course type alias
        const courseTypeAlias = coursesTypes.find( c => c.id == student.id_courses_types).alias
        
        // dates and sheets
        const weekMondayDate = dates.find(d => d.year == student.year && d.week_number == student.week_number && d.day_number == 1).date_string
        const dateString = `'${String(weekMondayDate)}/${student.year}`
        const sheet = `'Lunes ${String(weekMondayDate)}/${student.year} - ${courseTypeAlias}`
        const day = weekMondayDate.split('/')[0]
        const month = weekMondayDate.split('/')[1]
        const dateNumber = Number(student.year + month + day)

        // inscription
        const coursesData = data[i].coursesData
        const inscription = courseTypeAlias != 'LP' 
                            ? courseTypeAlias + ': ' + coursesData[0].category
                            : getInscription(coursesData)
        
        dataToPost.push([
            student.id,
            student.cuit_cuil,
            student.first_name.toUpperCase() + ' ' + student.last_name.toUpperCase(),
            student.email,
            student.phone_number,
            student.year,
            student.week_number,
            student.year_week,
            student.price,
            courseTypeAlias,
            inscription,
            sheet,
            dateString,
            dateNumber,
            data[i][5] == '' ? 0 : 1,
            data[i][6] == '' ? 0 : 1,
            data[i][7] == '' ? 0 : 1,
            data[i][8] == '' ? 0 : 1,
            data[i][9] == '' ? 0 : 1,
            data[i][10] == '' ? 0 : 1,
            data[i][11] == '' ? 0 : 1,
            data[i][12] == '' ? 0 : 1,
            data[i][13] == '' ? 0 : 1,
            data[i][14] == '' ? 0 : 1,
            data[i][15] == '' ? 0 : 1,
            data[i][16] == '' ? 0 : 1,
            0,
            0,
        ])
    })

    return dataToPost
}

async function deleteBulkData(spreadsheetId) {
    const sheets = await getSheets()

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'inscribir!A2:AQ'
    })
}

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

module.exports = { postData, getDataToPost, getInscriptionsData, getBulkInscriptionsData, getBulkDataToPost, deleteBulkData }
