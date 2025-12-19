// import g from "./globals.js"
// import { f } from "./functions.js"
import { domain } from "../../domain.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // login button
    loginBtn.addEventListener('click', async function(e) {

        loader.style.display = 'block'

        e.preventDefault()

        // find exams
        const weeksToShow = await (await fetch(`${domain}composed/get-last-n-weeks?weeks=8`)).json()
        const findStudent = await (await fetch(`${domain}get/students?cuit_cuil=${cuitCuil.value}&year_week=${JSON.stringify(weeksToShow)}`)).json()        

        if (cuitCuil.value == '' || findStudent.rows.length == 0) {
            error.style.display = 'flex'
            loader.style.display = 'none'            
        }else{
            error.style.display = 'none'
            loader.style.display = 'block'
            e.target.form.submit()
        }
    })

    

    loader.style.display = 'none'

    

})