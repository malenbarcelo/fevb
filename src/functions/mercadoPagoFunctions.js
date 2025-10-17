const mpCredentials = require('../data/mercadoPagoCredentials.js')

const mercadoPagoFunctions = {
    getMp: async() => {
        const accessToken = mpCredentials.find( mpc => mpc.type == 'malenDev').accessToken
        const mp = await import('mercadopago')
        const client = new mp.MercadoPagoConfig({ accessToken: accessToken })
        return { Preference: mp.Preference, client }
    }
}

module.exports = mercadoPagoFunctions