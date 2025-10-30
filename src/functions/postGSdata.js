const { google } = require('googleapis')
const credentials = require('../data/googleSheetsCredentials.json')
const dateQueries = require("../dbQueries/courses/datesQueries")

async function postData(dataToPost) {

    try {

        const spreadsheetId = '1PwmOCrSuWzZ5S7gWnBlx6fxW1plcCRkUhBuroQhOJzg'
        const range = 'inscriptos!A2'

        const sheets = await getSheets()
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED', 
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [dataToPost] }
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
      sessionData.cuit,
      sessionData.name.toUpperCase(),
      sessionData.email,
      sessionData.phone_number,
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
      sessionData.coursesData.find(cd => cd.category == 'E2') ? 'si' : 'no'
  ]

    return dataToPost
}

module.exports = { postData, getDataToPost }
