import { domain } from "../../domain.js"
import g from "./globals.js"

const f = {

    updateQuestion: async function() {

        g.questionData = g.questions.find( q => q.question_number == g.questionNumber)
        const options = g.questionData.question_options

        // hide error
        error.classList.add('not-visible')

        // update back button
        if (g.questionNumber == 1) {
            backBtn.classList.remove('pointer')
            backBtn.classList.remove('fc-1-hover-5')
            backBtn.classList.add('fc-gray')            
        }else{
            backBtn.classList.add('pointer')
            backBtn.classList.add('fc-1-hover-5')
            backBtn.classList.remove('fc-gray')
        }

        // update continue button
        if (g.questionNumber == g.questions.length) {
            g.buttonAction = 'finish'
            continueBtnText.innerText = 'FINALIZAR'                     
        }else{
            g.buttonAction = 'continue'
            continueBtnText.innerText = 'CONTINUAR'
        }

        // complete title
        question.innerText = g.questionData.question_number + '. ' + g.questionData.question

        // complete subtitle
        questionNumber.innerText = 'Pregunta ' + g.questionData.question_number + ' / ' + g.questions.length

        // add image if applies
        questionImages.innerHTML = ''
        
        if (g.questionData.includes_images == 1) {
            let html = ''
            const questionFiles = g.examImages.files.filter( i => i.split('_')[3] == 'question' + g.questionNumber)
            questionFiles.forEach(image => {
                let imageOption = image.split('_')[4].split('.')[0]
                imageOption = imageOption.at(-1) == 'U' ? '' : (imageOption.at(-1) + '.')
                html += '<div class="question-image-container">'
                html += imageOption == 'OU' ? '' : '<div>' + imageOption + ' </div>'
                html += '<img src="/images/examsImages/' + g.examImages.folder + '/' + image + '"" alt="FEVB" class="question-image">'
                html += '</div>'

                
            })
            questionImages.innerHTML = html
        }

        // complete options
        questionOptions.innerHTML = options
            .map((o) => `
                <div class="flex-r cg-3 ai-c mb-20 pointer">
                <input type="radio" class="pointer" id="question_${o.id}" name="checkAnswer">
                <label for="question_${o.id}" class="pointer">${o.option_reference}. ${o.option_text}</label>
                </div>
            `)
            .join('')

        // check input if applies
        const answer = g.lastAnswerDetails.find( a => a.id_exams_questions == g.questionData.id)
        const selectedOptions = answer.ids_selected_options == null ? [] : answer.ids_selected_options.split(',')
        
        selectedOptions.forEach(option => {
            const input = document.getElementById('question_' + option)
            input.checked = true
        })

        g.questionOptions = document.querySelectorAll('input[id^="question_"]')

        // options event listeners
        g.questionOptions.forEach(option => {
            option.addEventListener('click',async()=>{
                const checkedOptions = [...g.questionOptions].filter(qo => qo.checked)
                if (checkedOptions.length > 0) {
                    error.classList.add('not-visible')
                }
            })
        })
    }
}

export { f }