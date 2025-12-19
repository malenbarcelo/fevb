import { domain } from "../domain.js"

const f = {

    personalDataValidations: async function(cuitCuil, firstName, lastName, email, phone, errorText, studentError, studentErrorText) {

        let errors = 0
        let errorType = 'other'
        const weeksToFind = await (await fetch(`${domain}composed/get-last-n-weeks?weeks=12`)).json()
        const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const idCoursesTypes = [session.courseType.id]
        
        // find student        
        let findStudent = await (await fetch(`${domain}get/students?cuit_cuil=${cuitCuil.value}&year_week=${JSON.stringify(weeksToFind)}&id_courses_types=${JSON.stringify(idCoursesTypes)}`)).json()
        findStudent = findStudent.rows
    
        // validation
        if (firstName.value == '' || lastName.value == '' || email.value == '') {
    
            errors += 1
            errorText.innerText = 'Debe completar todos los campos'
    
        } else {
    
            const cuitCuilNumber = /^\d+$/.test(cuitCuil.value)
            const cuitCuilLength = cuitCuil.value.toString().length
    
            if (cuitCuil.value == '' || !cuitCuilNumber || cuitCuilLength != 11) {

                errors += 1
                errorText.innerText = 'El CUIT/CUIL debe ser numérico y debe poseer 11 dígitos'
    
            }else{
    
                const phoneNumber = /^\d+$/.test(phone.value)
                const phoneLength = phone.value.toString().length
    
                if (phone.value == '' || !phoneNumber || phoneLength < 7) {
    
                    errors += 1
                    errorText.innerText = 'El número de teléfono debe ser numérico y debe poseer como mínimo 7 dígitos'                    
    
                }else{
    
                    if (!emailRegex.test(email.value)) {
    
                        errors += 1
                        errorText.innerText = 'Email inválido'
                    }else{

                        if (findStudent.length > 0) {
                            
                            errors += 1

                            // alert
                            studentErrorText.innerHTML = 'Ya existe una reserva del tipo <span class="txt-u">' + session.courseType.type + '</span> para el CUIT/CUIL <span class="txt-u">' + cuitCuil.value + '</span>'
                            studentError.style.display = 'block'

                            errorType = 'existingStudent'
    
                        }
                    }
                }
            }
        }
    
        return { errors, errorType }
    }
}

export { f }