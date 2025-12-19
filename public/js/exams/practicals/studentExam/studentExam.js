window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })

    const swornDeclaration = document.getElementById('swornDeclaration')
    
    // get teachers inputs
    const teachersInputs = Array.from(document.querySelectorAll('input[name="teacher"]'))

    // get stages
    const stagesContainers = document.querySelectorAll('div[id^="stage_"]')
    
    // questions inputs
    const questionsInputsIds = document.querySelectorAll('input[id^="question_"]')
    const questionsInputs = [...new Set([...questionsInputsIds].map(r => r.name))]

    // get results inputs
    const resultsInputsIds = document.querySelectorAll('input[id^="results_"]')
    const resultsInputs = [...new Set([...resultsInputsIds].map(r => r.name))]

    sendAnswers.addEventListener("click", function(e) {

        loader.style.display = 'block'

        e.preventDefault()

        // validations
        let errors = 0

        // sworn declaration
        const stageSwornDeclaration = document.getElementById('stageSwornDeclaration')
        if (!swornDeclaration.checked) {
            errors += 1
            stageSwornDeclaration.classList.add('stage-container-error')
        }else{
            stageSwornDeclaration.classList.remove('stage-container-error')
        }

        // teachers
        const selectedTeacher = teachersInputs.find( ti => ti.checked)
        if (!selectedTeacher) {
            errors += 1
            stageTeachers.classList.add('stage-container-error')
        }else{
            stageTeachers.classList.remove('stage-container-error')
        }

        // questions
        console.log(questionsInputs)
        const incompleteQuestions = questionsInputs.some(name => {
            return !document.querySelector(`input[name="${name}"]:checked`)
        })

        if (incompleteQuestions) {
            errors +=1
            stagesContainers.forEach(s => s.classList.add('stage-container-error'))
        }else{
            stagesContainers.forEach(s => s.classList.remove('stage-container-error'))
        }

        // results
        const incompleteResults = resultsInputs.some(name => {
            return !document.querySelector(`input[name="${name}"]:checked`)
        })
        if (incompleteResults) {
            errors +=1
            stageResults.classList.add('stage-container-error')
        }else{
            stageResults.classList.remove('stage-container-error')
        }

        if (errors > 0) {
            examError.classList.remove('not-visible')
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            loader.style.display = 'none'
            
        }else{

            e.target.form.submit()
        }

        loader.style.display = 'none'

    })

    loader.style.display = 'none'
    

    

})