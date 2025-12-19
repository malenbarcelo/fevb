let g = {
    pendingExams: [],
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        enabled: 1,
        practicals_status: '["pending","not-passed"]',
        order: '[["id","ASC"]]',
        courses_types_alias: '',
        id_exams_practicals: '',
        cuit: '',
        name: ''
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
    ]
}

export default g