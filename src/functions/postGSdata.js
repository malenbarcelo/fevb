const { google } = require('googleapis')
const credentials = require('../data/googleSheetsCredentials.json')

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
        console.log('Listo', res.data.updates.updatedRange)
            
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

function getDataToPost(createdData,sessionData) {

  console.log(sessionData.schedule.shifts)

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
      `'${sessionData.schedule.daysShifts[0].day} ${sessionData.schedule.daysShifts[0].shifts[0].date_string}/${sessionData.schedule.daysShifts[0].shifts[0].year} - ${sessionData.courseType.alias}`,
      `'${sessionData.schedule.daysShifts[0].shifts[0].date_string}/${sessionData.schedule.daysShifts[0].shifts[0].year}`,
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
      sessionData.schedule.shifts.find( s => s.day_shift == 'DT') ? 1 : 0
  ]

    return dataToPost
}

module.exports = { postData, getDataToPost }
