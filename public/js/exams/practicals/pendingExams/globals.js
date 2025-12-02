let g = {
    pendingExams: [],
    examQuestions: [],
    popups: [cepp],
    stagesContainers: [ceppStageSwornDeclaration, ceppStageTeachers, ceppStageResults],
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        enabled: 1,
        practicals_status: '["pending","not-passed"]',
        order: '[["id","ASC"]]'
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // main table tooltips
    tooltips: [
        {
            icon:ceppIcon,
            right:'5.5%',
        }
    ],
    // inputs
    teachersInputs: [],
    questionsInputsNames: [],
    resultsInputsNames: [],
    // data to save
    studentsPracticalsAnswers: {}

}

export default g