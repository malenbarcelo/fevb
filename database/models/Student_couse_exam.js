module.exports = (sequelize, DataTypes) => {

   const alias = "Students_courses_exams"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_courses_exams',
      timestamps : false
   }

   const Student_course_exam = sequelize.define(alias, cols, config)

   Student_course_exam.associate = (models) => {
      Student_course_exam.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_course_exam.belongsTo(models.Courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      }),
      Student_course_exam.belongsTo(models.Students_exams,{
         as:'exam_data',
         foreignKey: 'id_students_exams'
      })
   }
   
   return Student_course_exam
}