let g = {
    pendingExams: [],
    dates:[],
    filters: {
        practicals_status: '["pending","not-passed","in-progress"]',
        order: '[["id","ASC"]]',
        id_courses_types: '',
        id_exams_practicals: '',
        cuit: '',
        name: ''
    },
    // main table tooltips
    tooltips: [
        {
            icon:ceppIcon,
            right:'5.5%',
        }
    ]
}

export default g