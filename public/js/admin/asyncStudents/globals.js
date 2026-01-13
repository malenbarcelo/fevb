
let g = {
    students:[],
    popups: [copp],
    page:0,
    pages:0,
    filters: {
        size:'',
        page:'',
        enabled: 1,
        courses_methodology: 'async',
        order: '[["commission_name","DESC"],["first_name","ASC"]]',
        commission_name:'',
        student_string:'',
        company_string:'',
        payment:'',
        status:'',
        cuit_cuil:''
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
    ],
    // elements
    action: '',
    elements: null,
    elementToDestroy: null,
    paymentToCheck: null,
    elementsToCreate: []
}

export default g