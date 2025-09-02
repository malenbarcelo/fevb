import { domain } from "../domain.js"
import gg from "../globals.js"
import { gf } from "../globalFunctions.js"

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload()
    }
})

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    const allChecks = Array.from(document.querySelectorAll('[id*="check_"]'))
    const allCats = Array.from(document.querySelectorAll('[id*="cat_"]'))
    const additional = await (await fetch(`${domain}get/courses/additional-per-category`)).json()
    const prices = await (await fetch(`${domain}get/courses/prices`)).json()
    const session = await (await fetch(`${domain}composed/inscriptions/get-session`)).json()
    const idCoursesTypes = session.courseType.id
    const courses = await (await fetch(`${domain}get/courses?id_courses_types=[${idCoursesTypes}]`)).json()

    // close popups
    gf.closePopups([cipp,sdpp])

    // close with escape
    gf.closeWithEscape([cipp,sdpp])

    // select type with checks
    allCats.forEach(element => {

        element.addEventListener('click',async()=>{

            catError.style.display = 'none'

            const courseId = element.id.split('_')[1]
            const check = document.getElementById('check_' + courseId)
            const category = courses.find( c => c.id == courseId).category
            const typeAlias = courses.find( c => c.id == courseId).type_alias
            
            // check item
            if (check.checked) {
                check.checked = false
                element.classList.remove('selected-cat')
            }else{
                check.checked = true
                element.classList.add('selected-cat')
            }

            // uncheck elements that can't be selected at the same time
            const idsToUnselect =  courses.filter( c => c.category == category && c.type_alias != typeAlias)
            const mapIds = idsToUnselect.map( i => i.id)
            const catsIds = mapIds.map( mi => 'cat_' + mi)
            const catsToUnselect = allCats.filter(cat => catsIds.includes(cat.id))

            catsToUnselect.forEach(cat => {
                const check = document.getElementById(cat.id.replace('cat','check'))
                cat.classList.remove('selected-cat')
                check.checked = false
            })

            // get price
            const selectedChecks = allChecks.filter( chck => chck.checked)
            const selectedCoursesIds = selectedChecks.map( sc => sc.id.split('_')[1]).map( sci => parseInt(sci))
            const selectedCourses = courses.filter( c => selectedCoursesIds.includes(c.id))
            const selectedCategories = [...new Set(selectedCourses.map(sc => sc.category[0]))]
            const selectedPrices = prices.filter( p => selectedCoursesIds.includes(p.id_courses))
            const maxPrice = Math.max(...selectedPrices.map(s => parseFloat(s.price)))
            const categoriesQty = selectedCategories.length
            const price = selectedCategories.length == 0 ? 0 : maxPrice + ( categoriesQty - 1) * parseFloat(additional.additional)
            totalPrice.innerHTML = '<b>Precio total: </b> ARS ' + gg.formatter.format(price)
            totalPriceInput.value = price
        })
    })

    // add styles if session
    if (session.selection) {
        allCats.forEach(element => {
            const typeId = element.id.split('_')[1]
            const categoryId = element.id.split('_')[2]            
            const check = document.getElementById('cat_' + typeId + '_' + categoryId)
            const selectedElement = session.selection.find( s => s.id_types == typeId && s.id_categories == categoryId)
            if (selectedElement) {
                element.click()               
            }
        })
    }

    // show categories info
    catInfo.addEventListener('click',async()=>{
        cipp.style.display = 'block'
    })

    // select sword declaration option    
    sdppDeclaration_1.addEventListener('click',async()=>{
        sdppCheck_1.checked = !sdppCheck_1.checked
        if (sdppCheck_1.checked && sdppCheck_2.checked ) {
            sdppError.style.display = 'none' 
            
        }
    })
    sdppDeclaration_2.addEventListener('click',async()=>{
        sdppCheck_2.checked = !sdppCheck_2.checked
        if (sdppCheck_1.checked && sdppCheck_2.checked ) {
            sdppError.style.display = 'none' 
            
        }
    })

    // continue
    continueButton.addEventListener('click',async()=>{

        loader.style.display = 'block'

        // validation
        types = allChecks.map( chk => chk.id.split('_')[1])
        types = [...new Set(types)]
        let selectedTypes = 0
        
        types.forEach(t => {
            const qty = allChecks.filter( chk => chk.checked && chk.id.split('_')[1] == t)
            if (qty.length > 0) {
                selectedTypes +=1
            }
        })
        
        if (selectedTypes != types.length) {
            catError.style.display = 'flex'
        } else {
            // show declaration
            if (types.includes('2')) {
                sdppText.innerHTML = 'Declaro que poseo <b>licencia clase B</b> de más de un año de antiguedad, vigente o vencida hace menos de 90 días y que comenzé el trámite en el sitio <b>lncargentina.seguridadvial.gob.ar</b> con las mismas categorías a las que me inscribo en este acto.'                              
            }else{
                sdppText.innerHTML = 'Declaro que poseo <b>licencia profesional</b> vigente o vencida hace menos de 90 días y que comencé el trámite en el sitio <b>lncargentina.seguridadvial.gob.ar</b> con las mismas categorías a las que me inscribo en este acto.'

            }
            sdppCheck_1.checked = false
            sdppCheck_2.checked = false
            sdppError.style.display = 'none'
            sdpp.style.display = 'block'            
        }

        loader.style.display = 'none'

    })

    // submit
    submitButton.addEventListener('click', function(e) {

        loader.style.display = 'block'

        e.preventDefault()
        
        if (!sdppCheck_1.checked || !sdppCheck_2.checked) {
            sdppError.style.display = 'flex'
            loader.style.display = 'none'            
        }else{
            loader.style.display = 'block'
            sdpp.style.display = 'none'
            e.target.form.submit()
        }

        
    })

    loader.style.display = 'none'
})