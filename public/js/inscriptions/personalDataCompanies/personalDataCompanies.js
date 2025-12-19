import g from "./globals.js"
import { gf } from "../../globalFunctions.js"
import { printTable } from "./printTable.js"
import { domain } from "../../domain.js"

// popups
import { cesppEventListeners} from "./personalDataCompaniesCESPP.js"
import { coppEventListeners} from "./personalDataCompaniesCOPP.js"
import { ulppEventListeners} from "./personalDataCompaniesULPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // get data
    const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()
    const idCourses = session.coursesData.map( cd => cd.id)
    g.prices = await (await fetch(`${domain}get/courses/prices?order=[["quantity","ASC"]]&id_courses=${JSON.stringify(idCourses)}`)).json()

    // get data
    printTable()    
    
    // close popups
    gf.closePopups(g.popups)

    // close with escape
    gf.closeWithEscape(g.popups)

    // show tooltips
    gf.showTooltips(g.tooltips,295,320)

    // popups event listeners
    cesppEventListeners()
    coppEventListeners()
    ulppEventListeners()

    // add student
    cesppAddStudent.addEventListener('click',()=>{
        gf.clearInputs(g.cesppInputs)
        g.action = 'create'
        cesppAcceptButton.innerText = 'AGREGAR'
        cesppError.style.display = 'none'
        cesppStudentError.style.display = 'none'
        cespp.style.display = 'block'
        cesppFirstName.focus()
    })

    // view prices lists
    pricesListsDetails.addEventListener('click',()=>{
        plpp.style.display = 'block'
    })

    // upload list
    ceppUploadList.addEventListener('click',()=>{
        gf.isValid([ulppFile])
        ulppErrorsBox.classList.add('not-visible')
        ulpp.style.display = 'block'
    })

    // continue
    continueButton.addEventListener('click',async()=>{
        if (g.students.length == 0) {
            continueError.classList.remove('not-visible')
        }else{

            const data = {
                price: g.price,
                students: g.students
            }

            const response = await fetch(domain + 'inscripciones/datos-personales',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (responseData.response == 'ok') {
                window.location.href = '/inscripciones/confirmar-inscripcion'
            }
        }
    })


    loader.style.display = 'none'

    

})