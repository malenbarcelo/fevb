
let g = {
    studentsCoursesExams:[],
    popups: [copp],
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
    // elements to manage
    action: null,
    repre: null,
    elementToUpdate: null
    
}

export default g