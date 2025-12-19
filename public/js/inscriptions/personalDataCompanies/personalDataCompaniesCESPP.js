import g from "./globals.js"
import { printTable } from "./printTable.js"
import { f } from "../functions.js"

// create edit student popup (cespp)
async function cesppEventListeners() {

    // confirm popup
    cesppAcceptButton.addEventListener('click',async()=>{

        loader.style.display = 'block'

        let { errors, errorType} = await f.personalDataValidations(cesppCuitCuil, cesppFirstName, cesppLastName, cesppEmail, cesppPhone, cesppErrorText, cesppStudentError, cesppStudentErrorText)

        // existing cuit/cuil error
        if (errors == 0) {
            const findStudent = g.students.find( s => s.cuit_cuil == cesppCuitCuil.value)
            if (findStudent) {
                errorType = 'other'
                errors += 1
                cesppErrorText.innerText = 'El CUIT/CUIL ingresado ya se encuentra en la lista de alumnos a ingresar'
            }
        }

        if (errors > 0) {
            if (errorType == 'other') {
                cesppError.style.display = 'flex'
                cesppStudentError.style.display = 'none'
            }else{
                cesppError.style.display = 'none'
                cesppStudentError.style.display = 'block'
            }
            
            loader.style.display = 'none'
            
        }else{

            cesppError.style.display = 'none'

            if (g.action == 'create') {
                g.students.push({
                    index: g.students.length == 0 ? 1 : g.students[g.students.length - 1].index + 1,
                    cuit_cuil: cesppCuitCuil.value,
                    first_name: cesppFirstName.value,
                    last_name: cesppLastName.value,
                    email: cesppEmail.value,
                    phone_number: cesppPhone.value
                })

            }else{
                const student = g.students.find(s => s.index == g.indexStudentToEdit)
                student.cuit_cuil = cesppCuitCuil.value,
                student.first_name = cesppFirstName.value,
                student.last_name = cesppLastName.value,
                student.email = cesppEmail.value,
                student.phone_number = cesppPhone.value
            }

            printTable()

            cespp.style.display = 'none'

            loader.style.display = 'none'

        }

    })
}

export { cesppEventListeners }