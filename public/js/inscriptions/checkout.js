
import { domain } from "../domain.js"

window.addEventListener('load',async()=>{

    // continue button
    continueButton.addEventListener('click', function(e) {

        loader.style.display = 'block'
        e.target.form.submit()
        
    })
    // continueButton.addEventListener('click', async function() {

    //     loader.style.display = 'block'

    //     const r = await fetch(domain + 'composed/mercado-pago/create-preferences',{
    //         method:'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify()
    //     })

    //     if (!r.ok) {
    //         const err = await r.json().catch(() => ({}))
    //         throw new Error(err.error || 'No se pudo crear la preferencia')
    //     }

    //     const { init_point, sandbox_init_point } = await r.json()

    //     const payUrl = init_point || sandbox_init_point

    //     if (!payUrl) throw new Error('No recibí la URL de pago')

    //     // redirect
    //     window.location.href = payUrl

    //     loader.style.display = 'none'
        
    // })
})