let gg = {
    lastClickTime:0,
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        useGrouping: true
    }),
    formatter0:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
    }),
    formatter2:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,        
        useGrouping: true
    }),
    formatter1:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: true
    }),    
}

export default gg