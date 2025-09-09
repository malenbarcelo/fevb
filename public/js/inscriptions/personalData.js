import { domain } from "../domain.js"
import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow',async()=>{

    loader.style.display = 'block'
    const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // close popups
    gf.closePopups([ecpp])

    // close with escape
    gf.closeWithEscape([ecpp])

    // continue
    continueButton.addEventListener('click', async function(e) {

        loader.style.display = 'block'
        
        e.preventDefault()

        const getWeekAndDay = await (await fetch(`${domain}composed/get-week-and-day`)).json()
        const date = new Date()
        const currYear = date.getFullYear()
        const prevYear = currYear -1
        const nextYear = currYear + 1
        const weeksInCurrYear = await (await fetch(`${domain}composed/get-weeks-in-year?year=${currYear}`)).json()
        const weeksInPrevYear = await (await fetch(`${domain}composed/get-weeks-in-year?year=${prevYear}`)).json()
        const weekNumber = getWeekAndDay.weekNumber
        
        // week1
        const week1 = weekNumber == 1 ? (weeksInPrevYear - 2) : (weekNumber == 2 ? (weeksInPrevYear - 1) : (weekNumber == 3 ? weeksInPrevYear : (weekNumber - 3)))
        const year1 = weekNumber <= 3 ? prevYear : currYear
        const weekYear1 = year1 + '_' + week1

        // week2
        const week2 = weekNumber == 1 ? (weeksInPrevYear - 1) : (weekNumber == 2 ? weeksInPrevYear : weekNumber - 2)
        const year2 = weekNumber <= 2 ? prevYear : currYear
        const weekYear2 = year2 + '_' + week2

        // week3
        const week3 = weekNumber == 1 ? weeksInPrevYear : (weekNumber - 1)
        const year3 = weekNumber <= 1 ? prevYear : currYear
        const weekYear3 = year3 + '_' + week3

        // week4
        const weekYear4 = currYear + '_' + weekNumber

        // week5
        const week5 = weekNumber == weeksInCurrYear ? 1 : (weekNumber + 1)
        const year5 = weekNumber == weeksInCurrYear ? nextYear : currYear
        const weekYear5 = year5 + '_' + week5

        // week6
        const week6 = weekNumber == weeksInCurrYear ? 2 : (weekNumber == (weeksInCurrYear - 1) ? 1 : (weekNumber + 2))
        const year6 = weekNumber >= (weeksInCurrYear - 1) ? nextYear : currYear
        const weekYear6 = year6 + '_' + week6

        // week7
        const week7 = weekNumber == weeksInCurrYear ? 3 : (weekNumber == (weeksInCurrYear - 1) ? 2 : (weekNumber == (weeksInCurrYear - 2) ? 1 : (weekNumber + 3)))
        const year7 = weekNumber >= (weeksInCurrYear - 2) ? nextYear : currYear
        const weekYear7 = year7 + '_' + week7

        const weeksToFind = [weekYear1,weekYear2,weekYear3,weekYear4, weekYear5, weekYear6, weekYear7]

        // find student
        const idCoursesTypes = [session.courseType.id]
        let findStudent = await (await fetch(`${domain}get/students?cuit=${cuit.value}&year_week=${JSON.stringify(weeksToFind)}&id_courses_types=${JSON.stringify(idCoursesTypes)}`)).json()
        findStudent = findStudent.rows

        // validation
        if (nameInfo.value == '' || email.value == '') {
            errorText.innerText = 'Debe completar todos los campos'
            personalDataError.style.display = 'flex'
            loader.style.display = 'none'
        } else {
            const cuitNumber = /^\d+$/.test(cuit.value)
            const cuitLength = cuit.value.toString().length
            
            if (cuit.value == '' || !cuitNumber || cuitLength != 11) {
                errorText.innerText = 'El CUIT debe ser numérico y debe poseer 11 dígitos'
                personalDataError.style.display = 'flex'
                loader.style.display = 'none'
            }else{
                const phoneNumber = /^\d+$/.test(cuit.value)
                const phoneLength = phone.value.toString().length
                if (phone.value == '' || !phoneNumber || phoneLength < 7) {
                    errorText.innerText = 'El número de teléfono debe ser numérico y debe poseer como mínimo 7 dígitos'
                    personalDataError.style.display = 'flex'
                    loader.style.display = 'none'
                }else{
                    if (!emailRegex.test(email.value)) {
                        errorText.innerText = 'Email incorrecto'
                        personalDataError.style.display = 'flex'
                        loader.style.display = 'none'
                    }else{
                        if (findStudent.length > 0) {
                            
                            // alert
                            ecppCuit.innerHTML = 'Ya existe una reserva del tipo <span class="txt-u">' + session.courseType.type + '</span> para el CUIT <span class="txt-u">' + cuit.value + '</span>'

                            ecpp.style.display = 'block'

                            loader.style.display = 'none'
                            
                        }else{
                            e.target.form.submit()
                        }
                    }
                }
            }
        }
    })

    loader.style.display = 'none'
})