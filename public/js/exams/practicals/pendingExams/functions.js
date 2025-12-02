import { domain } from "../../../domain.js"
import g from "./globals.js"

const f = {
    getData: async function() {

        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.enabled == '' ? '' : `&enabled=${g.filters.enabled}`
        filters += g.filters.practicals_status == '' ? '' : `&practicals_status=${g.filters.practicals_status}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${domain}get/students-exams?${filters}`)).json()

        g.pages = fetchData.pages

        return fetchData.rows
    },

    getExamQuestions: async function(idExams) {

        let filters = ''
        filters += `&exam_practical_version=1`
        filters += `&order=[["stage_number","ASC"],["question_number","ASC"]]`
        filters += `&id_exams_practicals=${idExams}`
        filters += `&enabled=1`

        const questions = await (await fetch(`${domain}get/exams/practicals/questions?${filters}`)).json()

        // structure info
        let stages = questions.map(q => ({
            stage_number: q.stage_number,
            stage_name: q.stage_name
        }))
        stages = [
            ...new Map(
                stages.map(s => [s.stage_number, s])
            ).values()
        ]

        g.examQuestions = []

        stages.forEach(stage => {
            const stageQuestions = questions.filter( q => q.stage_number == stage.stage_number)
            g.examQuestions.push({stage_name:stage.stage_name, stage_number: stage.stage_number,questions:stageQuestions})
        })
        
    },

    printExamQuestions: function() {

        ceppQuestions.innerHTML = ''
        let html = ''

        // exams stages
        g.examQuestions.forEach(stage => {            
            
            html += `<div class="stage-container" id="ceppStage_${stage.stage_number}">`
            
                html += `<div class="practical-question-text mb-20 fw-b">${stage.stage_name.toUpperCase()}</div>`

                stage.questions.forEach(question => {
                    
                    const css = question.question_number % 2 == 0 ? 'practical-question-option-even' : 'practical-question-option-odd'

                    html += `<div class="practical-question-box ${css}">`
                        html += `<div class="practical-question">${question.question_number}. ${question.question}</div>`
                        html += `<div class="practical-question-options">`
                            question.question_options.forEach(option => {
                                html += `<div class="flex-r cg-3 ai-c pointer">`
                                html += `<input type="radio" class="pointer" value="ceppOption_${question.id}_${option.id}" id="ceppOption_${question.id}_${option.id}" name="question_${question.id}">`
                                html += `<label for="ceppOption_${question.id}_${option.id}" class="pointer">${option.option_text}</label>`
                                html += `</div>`
                            });
                            
                        html += `</div>`
                    html += `</div>`
                    
                })

                html += `<div class="mt-25 mb-5 fw-b">Observaciones ${stage.stage_name.toUpperCase()}</div>`
                html += `<input type=text class="practical-input-obs" id="ceppObsStage_${stage.stage_number}">`
            
            html += `</div>`
        });

        ceppQuestions.innerHTML = html
        
    },

    printExamResults: function() {

        ceppResults.innerHTML = ''
        let html = ''

        // exams stages
        g.examQuestions.forEach((stage, index) => {

            const css = index % 2 == 0 ? 'practical-question-option-odd' : 'practical-question-option-even'

            html += `<div class="practical-question-box ${css}">`
                html += `<div class="practical-question">${stage.stage_name.toUpperCase()}</div>`
                html += `<div class="practical-question-options">`
                    // passed
                    html += `<div class="flex-r cg-3 ai-c pointer">`
                    html += `<input type="radio" class="pointer" value="ceppResults_passed_${stage.stage_number}" id="ceppResults_passed_${stage.stage_number}" name="ceppResults_${stage.stage_number}">`
                    html += `<label for="ceppResults_passed_${stage.stage_number}" class="pointer">Aprueba</label>`
                    html += `</div>`
                    // not-passed
                    html += `<div class="flex-r cg-3 ai-c pointer">`
                    html += `<input type="radio" class="pointer" value="ceppResults_notPassed_${stage.stage_number}"  id="ceppResults_notPassed_${stage.stage_number}" name="ceppResults_${stage.stage_number}">`
                    html += `<label for="ceppResults_notPassed_${stage.stage_number}" class="pointer">Desaprueba</label>`
                    html += `</div>`
                html += `</div>`
            html += `</div>`
        });

        ceppResults.innerHTML = html
        
    },

    // resetData: async function() {
        
    //     //update scroll data
    //     g.filters.page = 1
    //     g.loadedPages = new Set()
    //     g.previousScrollTop = 0

    //     //get and print data
    //     g.pricesLists = await this.getData()
    //     printTable()

    //     // unscroll
    //     table.scrollTop = 0
    // }
}

export { f }