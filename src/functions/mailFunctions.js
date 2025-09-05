const nodemailer = require('nodemailer')
const credentials = require('../data/gmailCredentials.json')
const { google } = require('googleapis')

async function transporterData() {

    try {
        
        const CLIENT_ID = credentials.client_id
        const CLIENT_SECRET = credentials.client_secret
        const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
        const REFRESH_TOKEN = credentials.refresh_token
        const GMAIL_USER = 'infoelvientoblanco@gmail.com'

        const oAuth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        )

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        const td = {
            oAuth2Client: oAuth2Client,
            gmailUser: GMAIL_USER,
            clientId: CLIENT_ID,
            clienSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN
        }

        return td

    } catch (error) {
        console.error('Error en transporterData:', error)
    }
}

async function sendMail(td,mailData) {

    try {
        const accessToken = await td.oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: td.gmailUser,
                clientId: td.clientId,
                clientSecret: td.clienSecret,
                refreshToken: td.refreshToken,
                accessToken: accessToken.token,
            },
        })

        const mailOptions = {
            from: `El Viento Blanco <${td.gmailUser}>`,
            to: mailData.email,
            subject: 'Confirmación de incripción',
            //text: '¡Hola! Este es un correo enviado desde Node.js con OAuth2.',
            html: `
                <h3 style="color:black;">Hola ${mailData.name},</h3>                
                <p style="color:black;">Gracias por completar tu inscripción.</p>
                <p style="color:red;"><b>Para reservar tu cupo, por favor transferí $ ${mailData.price} al alias "farola.burla.caucho"<br>y enviá el comprobante a comprobantes@elvientoblanco.org.ar<br>dentro de las próximas 24 hs.</b></p>
                <p style="color:black;"><b>RESUMEN DE LA INSCRIPCIÓN:</b>${mailData.selection}</p>
                <p style="color:black;"><b>HORARIO:</b><br>${mailData.scheduleDescription}</p>
                <p style="color:black;"><b>DOMICILIO:</b><br>Colón 388, entre Roca y Belgrano, Neuquén.<br>Instituto FAENA, Piso 3.</p>
                <p style="color:black;"><b>TUS DATOS:</b><br>Nombre: ${mailData.name}<br>CUIT: ${mailData.cuit}</p>
                <p style="color:black;">Muchas gracias,<br><b>Fundación El Viento Blanco</b></p>
            `
        }

        const result = await transporter.sendMail(mailOptions)

        console.log('Correo enviado:', result.response)
            
    } catch (error) {
        console.error('Error al enviar el correo:', error)
    }
}

module.exports = {transporterData, sendMail}

