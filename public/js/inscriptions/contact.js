import { gf } from "../globalFunctions.js"

window.addEventListener('load',async()=>{

    // close popups
    const popups = [conpp]
    gf.closePopups(popups)

    // close with escape
    gf.closeWithEscape(popups)

    viewContact.addEventListener('click', function(e) {
        conpp.style.display = 'block'        
    })
})