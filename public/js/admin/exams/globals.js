
let g = {
    studentsCoursesExams:[],
    popups: [],
    pages:0,
    filters: {
        size:'',
        page:'',
        order: '[["id","DESC"]]',
        name: '',
        cuit_cuil_string:'',
        repre:'',
        enabled: 1

    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    
}

export default g