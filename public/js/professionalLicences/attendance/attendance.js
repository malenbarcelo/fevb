import { domain } from "../../domain.js"

window.addEventListener('load',async()=>{
    
    printButton.addEventListener('click',async()=>{

        const data = {
            week_number: selectWeek.value.split('_')[0],
            year: selectWeek.value.split('_')[1]
        }
        
        const response = await fetch(domain + 'composed/professional-licences/download-attendance-list',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Asistencia.xlsx'
            document.body.appendChild(a)
            a.click()
            a.remove()
        } else {
            console.error('Error al descargar el archivo:', response.statusText);
        }

    })

    
})