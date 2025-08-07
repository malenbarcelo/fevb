const createExcel = {
    addMainTableHeaders: (ws, commissionNumber) => {        
                
            // merge cells
            ws.mergeCells('G4', 'J4')
            ws.mergeCells('K4', 'L4')
            
            // title
            const mainCells = ['G4', 'K4']
            
            mainCells.forEach(cellRef => {
                const cell = ws.getCell(cellRef)
                cell.value = cellRef === 'G4' ? 'Formación específica - Comisión ' + commissionNumber : 'Curso inicial único'
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.font = { bold: true }
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDDDDDD' }
                }
            })

            // border and background
            const fillAndBorder = (startCol, endCol, row) => {
                for (let col = startCol; col <= endCol; col++) {
                    const cell = ws.getCell(row, col)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFDDDDDD' } // gris claro
                    }
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                }
            }

            // G4:J4 = col 7 to 10, row 4
            fillAndBorder(7, 10, 4)
            // K4:L4 = col 11 to 14, row 4
            fillAndBorder(11, 12, 4)

    },
    addSecondaryTableHeaders: (ws,headers,startCol,rowNumber) => {

        headers.forEach((text, index) => {
            const cell = ws.getCell(rowNumber, startCol + index)
            cell.value = text
            cell.font = { bold: true }
            cell.alignment = { horizontal: 'center', vertical: 'middle' }
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFDDDDDD' } // gray
            }
            cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
            }
        })
    },
    columnWidth: (ws) => {

        ws.getColumn('B').width = 15
        ws.getColumn('C').width = 20
        ws.getColumn('D').width = 30
        ws.getColumn('E').width = 15
        ws.getColumn('F').width = 20

    },
    addRowsData: (ws,data,startRow,startColumn) => {

        data.forEach((element, index) => {

            // get selection summary
            const types = element.selection.map( s => s.type_data.type)
            const uniqueTypes = [...new Set(types)]
            const selection = []
            uniqueTypes.forEach(ut => {
                selection.push({
                    type:ut,
                    typeToShow: ut[0].toUpperCase(),
                    categories: element.selection.filter( s => s.type_data.type == ut).map( cat => cat.category_data.category).join(', ')
                })
            })
            const selectionString = selection.map( s => s.typeToShow + ': ' + s.categories).join(' | ')

            // define if attendance applies
            const column7 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'LM').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'XM').length > 0)
            const column8 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'LT').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'XT').length > 0)
            const column9 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'MM').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'JM').length > 0)
            const column10 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'MT').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'JT').length > 0)
            const column11 = element.commission_number == 1 && element.attendance.filter( a => a.shift == 'XM').length > 0
            const column12 = element.commission_number == 1 && element.attendance.filter( a => a.shift == 'XT').length > 0

            // add data to rows            
            const row = ws.getRow(startRow + index)

            row.getCell(startColumn).value = element.cuit
            row.getCell(startColumn + 1).value = element.name
            row.getCell(startColumn + 2).value = element.email
            row.getCell(startColumn + 3).value = String(element.phone_number)
            row.getCell(startColumn + 4).value = selectionString
            
            row.getCell(startColumn + 5).fill = column7 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 6).fill = column8 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 7).fill = column9 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 8).fill = column10 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 9).fill = column11 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 10).fill = column12 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}

            // styles
            for (let col = startColumn; col <= startColumn + 10; col++) {
                const cell = row.getCell(col)
                
                // alignment
                cell.alignment = { vertical: 'middle', horizontal: 'center' }

                // border
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            }

            row.commit()

        })
    },
}

module.exports = createExcel