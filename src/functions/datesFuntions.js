const datesFunctions = {

    getWeekNumber: (date) => {

        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        const dayNumber = target.getUTCDay() || 7
        target.setUTCDate(target.getUTCDate() + 4 - dayNumber)
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
        const weekNumber = Math.ceil(((target - yearStart) / 86400000 + 1) / 7)
        return { weekNumber , dayNumber }
    },

    getWeeksInYear: (year) => {
        
        function isLeapYear(y) {
            return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
        }

        const lastDay = new Date(year, 11, 31) // 31/12
        const day = lastDay.getDay()

        // Si 31 de diciembre cae en jueves (4) o miércoles (3) en año bisiesto
        if (day === 4 || (day === 3 && isLeapYear(year))) {
            return 53
        }
        return 53
    },

    weeksToShow: () => {        
        const date = new Date()
        const year = date.getFullYear()
        const {weekNumber,dayNumber} = datesFunctions.getWeekNumber(date)
        const lastWeek = datesFunctions.getWeeksInYear(year)

        const week1 = weekNumber
        const year1 = year

        const week2 = weekNumber == lastWeek ? 1 : weekNumber + 1
        const year2 = (weekNumber == lastWeek || weekNumber == 1 && lastWeek == 53) ? year1 + 1 : year1
        const week3 = week2 == lastWeek ? 1 : week2 + 1
        const year3 = week2 == lastWeek ? year2 + 1 : year2
        const week4 = week3 == lastWeek ? 1 : week3 + 1
        const year4 = week3 == lastWeek ? year3 + 1 : year3
        const week5 = week4 == lastWeek ? 1 : week4 + 1
        const year5 = week4 == lastWeek ? year4 + 1 : year4
        const week6 = week5 == lastWeek ? 1 : week5 + 1
        const year6 = week5 == lastWeek ? year5 + 1 : year5

        const weeksToShow = [
            { week_number:week1, year:year1 },
            { week_number:week2, year:year2 },
            { week_number:week3, year:year3 },
            { week_number:week4, year:year4 },
            { week_number:week5, year:year5 },
            { week_number:week6, year:year6 }
        ]

        return weeksToShow
    },

    getNweeks: (weeks) => {

        const date = new Date()
        const dateArg = new Date(date.getTime() - 3 * 60 * 60 * 1000)
        const year = dateArg.getFullYear()
        const weekAndDay = datesFunctions.getWeekNumber(dateArg)

        const previousWeeks = weeks % 2 === 0 ? weeks / 2 : Math.floor(weeks / 2) + 1
        const nextWeeks = Math.floor(weeks / 2)

        let weeksToShow = [year + '_' + weekAndDay.weekNumber]

        // previous weeks
        for (let i = 0; i < previousWeeks; i++) {
            
            const previousYear = Number(weeksToShow[weeksToShow.length - 1].split('_')[0])
            const previousWeek = Number(weeksToShow[weeksToShow.length - 1].split('_')[1])
            let year
            let week

            if (previousWeek == 1) {
                year = previousYear - 1
                week = datesFunctions.getWeeksInYear(year)                    
            }else{
                year = previousYear
                week = previousWeek - 1
            }

            weeksToShow.push(year + '_' + week)
        }

        weeksToShow = weeksToShow.reverse()

        // next weeks
        for (let i = 0; i < nextWeeks; i++) {
            
            const previousYear = Number(weeksToShow[weeksToShow.length - 1].split('_')[0])
            const previousWeek = Number(weeksToShow[weeksToShow.length - 1].split('_')[1])
            const lastWeek = datesFunctions.getWeeksInYear(previousYear)

            let year
            let week

            if (previousWeek == lastWeek) {
                year = previousYear + 1
                week = 1                    
            }else{
                year = previousYear
                week = previousWeek + 1
            }

            weeksToShow.push(year + '_' + week)
        }
        
        return weeksToShow
    },

}

module.exports = datesFunctions