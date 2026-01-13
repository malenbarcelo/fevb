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

async function sendMail(td,mailData,html) {

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

        // define html
        // let html
        // if (mailData.courseAlias != 'SP') {
        //     html = `<p style="color:black;"><b>HORARIO:</b><br>${mailData.scheduleDescription}</p>
        //         <p style="color:black;"><b>DOMICILIO:</b><br>Colón 388, entre Roca y Belgrano, Neuquén.<br>Instituto FAENA, Piso 3.</p>`
        // }else{
        //     html = `<p style="color:black;"><b>INFORMACIÓN:</b><br>La cursada es 100% vitual; usted podrá gestionar su avance desde una plataforma web.<br>Se realizará una charla informativa el día <b>${mailData.scheduleDescription}</b>.<br>
        //     ${mailData.inscriptionType == 'personal' ? 'Una vez que se confirme su pago, se le enviará a su mail la información necesaria para poder iniciar el curso' : '<b style="margin-top:15px;">ALUMNOS INSCRIPTOS:</b> ' + mailData.quantity + '. Puede ver el detalle de alumnos en el archivo adjunto'}.</p>`
        // }

        const mailOptions = {
            from: `El Viento Blanco <${td.gmailUser}>`,
            to: mailData.email,
            subject: 'Confirmación de incripción',
            html: html
            // html: `
            //     <h3 style="color:black;">Hola ${mailData.name},</h3>                
            //     <p style="color:black;">Gracias por completar tu inscripción.</p>
            //     <p style="color:red;"><b>Para reservar el cupo, por favor transferí $ ${mailData.price} al alias "farola.burla.caucho"<br>y enviá el comprobante a comprobantes@elvientoblanco.org.ar<br>dentro de las próximas 24 hs.</b></p>
            //     <p style="color:black;"><b>RESUMEN DE LA INSCRIPCIÓN:</b>${mailData.selection}</p>
            //     ${html}
            //     <p style="color:black;"><b>TUS DATOS:</b><br>Nombre: ${mailData.name}<br>${mailData.inscriptionType == 'company' ? ('Empresa: ' + mailData.company)  : ('CUIT/CUIL: ' + 'CUIT/CUIL: ' + mailData.cuitCuil) }</p>
            //     <p style="color:black;">Muchas gracias,<br><b>Fundación El Viento Blanco</b></p>
            // `
        }

        const result = await transporter.sendMail(mailOptions)

        console.log('Correo enviado:', result.response)
            
    } catch (error) {
        console.error('Error al enviar el correo:', error)
    }
}

function createTemplate(mailData) {

        const htmlTemplate = mailData.courseMethodology + '_' + mailData.inscriptionType

        const html = {
            async_company: `
                <h3 style="color:black;">Hola ${mailData.name},</h3>                
                <p style="color:black;">Gracias por completar la inscripción.</p>
                <p style="color:red;"><b>Para reservar el cupo de los alumnos, por favor transferí $ ${mailData.price} al alias "farola.burla.caucho"<br>y enviá el comprobante a comprobantes@elvientoblanco.org.ar<br>dentro de las próximas 24 hs.</b></p>
                <p>Una vez confirmado el pago, se le enviará un mail a cada alumno con la información necesaria para iniciar el curso.</p>
                <p style="color:black;"><b>CURSO:</b>${mailData.selection}</p>
                <p style="color:black;"><b>INFORMACIÓN:</b><br>La cursada es 100% vitual; el alumno gestionará su avance a través de una plataforma web.<br>Se realizará una charla informativa el día <b>${mailData.scheduleDescription}</b>.
                <p style="color:black;"><b>ALUMNOS:</b><br>${mailData.quantity} alumnos inscriptos.</p>
                <p style="color:black;"><b>DATOS DE LA INSCRIPCIÓN:</b><br>Comisión: ${mailData.commission}<br>Número de inscripción: ${mailData.inscriptionNumber}</p>
                <p style="color:black;"><b>TUS DATOS:</b><br>Nombre: ${mailData.name}<br>Empresa: ${mailData.company}</p>
                <p style="color:black;">Muchas gracias,<br><b>Fundación El Viento Blanco</b></p>                
            `,
            async_particular: `
                <h3 style="color:black;">Hola ${mailData.name},</h3>                
                <p style="color:black;">Gracias por completar tu inscripción.</p>
                <p style="color:red;"><b>Para reservar tu cupo, por favor transferí $ ${mailData.price} al alias "farola.burla.caucho"<br>y enviá el comprobante a comprobantes@elvientoblanco.org.ar<br>dentro de las próximas 24 hs.</b></p>
                <p>Una vez confirmado el pago, se te enviará un mail con la información necesaria para iniciar el curso.</p>
                <p style="color:black;"><b>CURSO:</b>${mailData.selection}</p>
                <p style="color:black;"><b>INFORMACIÓN:</b><br>La cursada es 100% vitual; podrás gestionar tu avance desde una plataforma web.<br>Se realizará una charla informativa el día <b>${mailData.scheduleDescription}</b>.
                
                <p style="color:black;"><b>DATOS DE LA INSCRIPCIÓN:</b><br>Comisión: ${mailData.commission}<br>Número de inscripción: ${mailData.inscriptionNumber}</p>
                <p style="color:black;"><b>TUS DATOS:</b><br>Nombre: ${mailData.name}<br>CUIT/CUIL: ${mailData.cuitCuil}</p>
                <p style="color:black;">Muchas gracias,<br><b>Fundación El Viento Blanco</b></p>                
            `,
            sync_particular: `
                <h3 style="color:black;">Hola ${mailData.name},</h3>                
                <p style="color:black;">Gracias por completar tu inscripción.</p>
                <p style="color:red;"><b>Para reservar tu cupo, por favor transferí $ ${mailData.price} al alias "farola.burla.caucho"<br>y enviá el comprobante a comprobantes@elvientoblanco.org.ar<br>dentro de las próximas 24 hs.</b></p>
                <p style="color:black;"><b>CURSO:</b>${mailData.selection}</p>                
                <p style="color:black;"><b>HORARIO:</b><br>${mailData.scheduleDescription}</p>
                <p style="color:black;"><b>DOMICILIO:</b><br>Colón 388, entre Roca y Belgrano, Neuquén.<br>Instituto FAENA, Piso 3.</p>                
                <p style="color:black;"><b>DATOS DE LA INSCRIPCIÓN:</b><br>Comisión: ${mailData.commission}<br>Número de inscripción: ${mailData.inscriptionNumber}</p>
                <p style="color:black;"><b>TUS DATOS:</b><br>Nombre: ${mailData.name}<br>CUIT/CUIL: ${mailData.cuitCuil}</p>
                <p style="color:black;">Muchas gracias,<br><b>Fundación El Viento Blanco</b></p>                
            `,

        }
        
        return html[htmlTemplate]
        
    }

module.exports = {transporterData, sendMail, createTemplate}

