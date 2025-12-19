const sessionInscriptions = {
  courseType: {
    alias: 'SP',
    enabled: 1,
    id:4,
    type: 'SEGURIDAD PRIVADA'
  },
  coursesData: [
    {
      id: 31,
      course_name: 'Personal de Seguridad Privada',
      course_description: 'Personal de Seguridad Privada',
      alias: 'personal_seguridad_privada',
      id_courses_types: 4,
      type: 'Obtención',
      type_alias: 'O',
      type_action: 'Obtener',
      category: 'PSP',
      ciu: 0,
      id_exams_theoricals: 6,
      id_exams_practicals: 6,
      expiration_time_days: 60,
      course_methodology: 'async',
      weeks_to_show: 6,
      allows_bulk_inscriptions: 1,
      enabled: 1
    }
  ],
  price: 130000,
  selectionSummary: [],
  schedule: {
    id: 1,
    week_number: 3,
    year: 2026,
    year_week: '2026_3',
    commission_number: 1,
    shifts: [
      {
        day_number: 1,
        day: 'Lunes',
        shift_alias: 'M',
        day_shift: 'LM',
        commission_number: 1,
        weeks: 'even',
        year: 2026,
        week_number: 3,
        year_week: '2026_3',
        date_string: '12/01',
        complete_date: '12/01/2026',
        unabledDate: false
      }
    ],
    daysShifts: [ [Object] ],
    shiftsDescription: 'Lu 12/01'
  },
  scheduleDescription: [ 'Lunes 12/01' ],
  personalData: [
    {
      first_name: 'juan',
      last_name: 'perez',
      cuit_cuil: '12345685214',
      email: 'barcelomalen@gmail.com',
      phone_number: 1234567
    },
    {
      first_name: 'juan2',
      last_name: 'perez2',
      cuit_cuil: '12345685214',
      email: 'barcelomalen2@gmail.com',
      phone_number: 1234567
    }
  ],
  hasPractical: 1,
  companyData: {
    company: 'EXXON',
    first_name: 'Juan',
    last_name: 'Exxon',
    email: 'barcelomalen@gmail.com',
    phone_number: 1234567
  },
  quantity: 1,
  personalData: [],
  inscriptionType: 'company'
}

module.exports = sessionInscriptions