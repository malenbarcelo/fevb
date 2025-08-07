const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const gf = {
    // mail configuration
    transporterData: (req,res) => {
        try{
            const transporterData = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'admvientoblanco@gmail.com',
                    pass: 'Vbe37!AB'     // Usá una App Password (no la contraseña común)
                }
            })

        return transporterData

            return transporterData
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = gf

