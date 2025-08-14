const { google } = require('googleapis')
const credentials = require('../data/googleSheetsCredentials.json')

async function postData(dataToPost) {

    try {

        const spreadsheetId = '1PwmOCrSuWzZ5S7gWnBlx6fxW1plcCRkUhBuroQhOJzg'
        const range = 'inscripciones!A2'

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

    console.log(sessionData)

    const dataToPost = [
        createdData.id,
        sessionData.cuit,
        sessionData.name.toUpperCase(),
        sessionData.email,
        sessionData.phone_number,
        createdData.year,
        createdData.week_number,
        createdData.price,
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'C1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'C2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'C3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'D1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'D2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'D3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Obtención' && s.category == 'E1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'E2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'C1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'C2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'C3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'D1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'D2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'D3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'E1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Ampliación' && s.category == 'E2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'C1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'C2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'C3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'D1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'D2') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'D3') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'E1') ? 'si' : 'no',
        sessionData.selection.find( s => s.type == 'Renovación' && s.category == 'E2') ? 'si' : 'no',
        sessionData.schedule.start_date.split(' ')[0]
    ]

     return dataToPost
}

module.exports = { postData, getDataToPost }
