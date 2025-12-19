import { gf } from "../../globalFunctions.js"
import { domain } from "../../domain.js"
import { printTable } from "./printTable.js"
import g from "./globals.js"

// upload list popup (ulpp)
async function ulppEventListeners() {

    // download template    
    ulppTemplate.addEventListener('click',async()=>{

        loader.style.display = 'block'

        const link = document.createElement("a")
        link.href = "/files/templates/Lista de alumnos - Template.xlsx"
        link.download = "Listas de alumnos - Template.xlsx"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        loader.style.display = 'none'
    })

    // upload list    
    ulppAccept.addEventListener('click',async()=>{
        
        loader.style.display = 'block'

        const errors = await ulppValidations()

        if (errors == 0) {
            
            const date = Date.now()

            const formData = new FormData()
            formData.append('suffix', date)
            formData.append('ulppFile', ulppFile.files[0])
            formData.append('students', g.students.map( s => s.cuit_cuil))

            const response = await fetch(domain + 'composed/files/update-personal-data-list',{
                method:'POST',
                body: formData
            })

            const responseData = await response.json()

            if (responseData.errors > 0) {

                ulppErrorsBox.classList.remove('not-visible')

                ulppErrorsList.innerHTML = ''

                responseData.errorsTexts.forEach(text => {
                    ulppErrorsList.innerHTML += '<li class="mt-5">' + text + '</li>'
                })

            }else{

                // add data to students
                responseData.rows.forEach(row => {
                    g.students.push({
                        index: g.students.length == 0 ? 1 : g.students[g.students.length - 1].index + 1,
                        cuit_cuil: row[2],
                        first_name: row[0],
                        last_name: row[1],
                        email: row[3],
                        phone_number: row[4]
                    })
                })

                // print table
                printTable()

                // hide loader
                loader.style.display = 'none'

                // close popup
                ulpp.style.display = 'none'
            }

        }

        loader.style.display = 'none'

    })
    
}

async function ulppValidations(){

    let errors = 0
    
    // file
    const allowedExtensions = ['xls', 'xlsm', 'xlsx']
    const fileValidations = [
        {'validation':'noFile','text': 'Debe seleccionar un archivo'},
        {'validation':'allowedExtensions','text': 'El archivo debe tener extensión .xls ó .xlsm ó .xlsx', allowedExtensions}
    ]

    errors += gf.validations(ulppFile, fileValidations)

    return errors
    
}

export {ulppEventListeners}