import g from "./globals.js"
import gg from "../../globals.js"

const functions = {

    updatePrice: function() {

        const qty = g.students.length == 0 ? 1 : g.students.length

        const selectedPrice = g.prices
            .filter(p => qty >= p.quantity)
            .sort((a, b) => b.quantity - a.quantity)[0]

        const price = selectedPrice?.price * qty

        g.price = price

        personalDataPrice.innerHTML = '<b>PRECIO (ARS): </b>'  + gg.formatter0.format(price)
        
    },
}

export { functions }