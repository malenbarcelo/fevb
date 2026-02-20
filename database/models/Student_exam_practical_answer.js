module.exports = (sequelize, DataTypes) => {

   const alias = "Students_exams_practicals_answers"

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
      id_students_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_practicals_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_selected_option:{
         type: DataTypes.INTEGER,
         allowNull: true,
      }
   }

   const config = {
      tableName : 'students_exams_practicals_answers',
      timestamps : false
   }

   const Student_exam_practical_answer = sequelize.define(alias, cols, config)

   Student_exam_practical_answer.associate = (models) => {
      Student_exam_practical_answer.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_exam_practical_answer.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_exam_practical_answer.belongsTo(models.Exams_practicals_questions,{
         as:'question_data',
         foreignKey: 'id_exams_practicals_questions'
      })
   }
   
   return Student_exam_practical_answer
}