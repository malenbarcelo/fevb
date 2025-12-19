let gg = {
    lastClickTime:0,
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        useGrouping: true
    }),
    formatter0:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),    
}

export default gg