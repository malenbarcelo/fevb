const createExcel = {
    addMainTableHeaders: (ws, commissionNumber) => {        
                
        // merge cells
        ws.mergeCells('H4', 'K4')
        ws.mergeCells('L4', 'M4')
        
        // title
        const mainCells = ['H4', 'L4']
        
        mainCells.forEach(cellRef => {
            const cell = ws.getCell(cellRef)
            cell.value = cellRef === 'H4' ? 'Formación específica - Comisión ' + commissionNumber : 'Curso inicial único'
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

        // H4:K4 = col 8 to 11, row 4
        fillAndBorder(8, 11, 4)
        // L4:M4 = col 12 to 15, row 4
        fillAndBorder(12, 13, 4)

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

        ws.getColumn('B').width = 5
        ws.getColumn('C').width = 15
        ws.getColumn('D').width = 20
        ws.getColumn('E').width = 30
        ws.getColumn('F').width = 15
        ws.getColumn('G').width = 20
        ws.getColumn('N').width = 15

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
            const column8 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'LM').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'XM').length > 0)
            const column9 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'LT').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'XT').length > 0)
            const column10 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'MM').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'JM').length > 0)
            const column11 = (element.commission_number == 1 && element.attendance.filter( a => a.shift == 'MT').length > 0) || (element.commission_number == 2 && element.attendance.filter( a => a.shift == 'JT').length > 0)
            const column12 = element.commission_number == 1 && element.attendance.filter( a => a.shift == 'XM').length > 0
            const column13 = element.commission_number == 1 && element.attendance.filter( a => a.shift == 'XT').length > 0

            // add data to rows            
            const row = ws.getRow(startRow + index)

            row.getCell(startColumn).value = element.id
            row.getCell(startColumn + 1).value = element.cuit
            row.getCell(startColumn + 2).value = element.name
            row.getCell(startColumn + 3).value = element.email
            row.getCell(startColumn + 4).value = String(element.phone_number)
            row.getCell(startColumn + 5).value = selectionString
            
            row.getCell(startColumn + 6).fill = column8 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 7).fill = column9 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 8).fill = column10 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 9).fill = column11 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 10).fill = column12 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 11).fill = column13 ? '' : {type: 'pattern',pattern: 'solid',fgColor: { argb: 'FF808080' }}
            row.getCell(startColumn + 12).value = parseFloat(element.price)
            row.getCell(startColumn + 13).value = 'no'

            // selection
            row.getCell(startColumn + 15).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'C1') ? 'si' : 'no'
            row.getCell(startColumn + 16).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'C2') ? 'si' : 'no'
            row.getCell(startColumn + 17).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'C3') ? 'si' : 'no'
            row.getCell(startColumn + 18).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'D1') ? 'si' : 'no'
            row.getCell(startColumn + 19).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'D2') ? 'si' : 'no'
            row.getCell(startColumn + 20).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'D3') ? 'si' : 'no'
            row.getCell(startColumn + 21).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'E1') ? 'si' : 'no'
            row.getCell(startColumn + 22).value = element.selection.find( s => s.type_data.alias == 'O' && s.category_data.category == 'E2') ? 'si' : 'no'

            row.getCell(startColumn + 23).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'C1') ? 'si' : 'no'
            row.getCell(startColumn + 24).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'C2') ? 'si' : 'no'
            row.getCell(startColumn + 25).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'C3') ? 'si' : 'no'
            row.getCell(startColumn + 26).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'D1') ? 'si' : 'no'
            row.getCell(startColumn + 27).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'D2') ? 'si' : 'no'
            row.getCell(startColumn + 28).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'D3') ? 'si' : 'no'
            row.getCell(startColumn + 29).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'E1') ? 'si' : 'no'
            row.getCell(startColumn + 30).value = element.selection.find( s => s.type_data.alias == 'A' && s.category_data.category == 'E2') ? 'si' : 'no'

            row.getCell(startColumn + 31).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'C1') ? 'si' : 'no'
            row.getCell(startColumn + 32).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'C2') ? 'si' : 'no'
            row.getCell(startColumn + 33).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'C3') ? 'si' : 'no'
            row.getCell(startColumn + 34).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'D1') ? 'si' : 'no'
            row.getCell(startColumn + 35).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'D2') ? 'si' : 'no'
            row.getCell(startColumn + 36).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'D3') ? 'si' : 'no'
            row.getCell(startColumn + 37).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'E1') ? 'si' : 'no'
            row.getCell(startColumn + 38).value = element.selection.find( s => s.type_data.alias == 'R' && s.category_data.category == 'E2') ? 'si' : 'no'

            // styles
            for (let col = startColumn; col <= startColumn + 38; col++) {
                
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

            // cell price as number
            // const cell = row.getCell(startColumn + 12)
            // cell.numFmt = '#,##0.00'

            row.commit()

        })
    },
}

module.exports = createExcel