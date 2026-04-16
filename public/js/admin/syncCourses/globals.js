
let g = {
    students:[],
    popups: [],
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        enabled: 1,
        courses_methodology: 'sync',
        order: '',
        student_string:'',
        payment:'',
        attendance:'',
        cuit_cuil:'',
        id_branches:'',

    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // main table tooltips
    tooltips: [
        {
            icon:esppIcon,
            right:'5.5%',
        },
        {
            icon:dsppIcon,
            right:'2%',
        },
    ]
}

export default g