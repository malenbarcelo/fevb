module.exports = (sequelize, DataTypes) => {

   const alias = "Students_practicals_answers_details"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_students_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students_practicals_answers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_practicals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_practicals_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_selected_option:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_correct_option:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      correct_answer:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_practicals_answers_details',
      timestamps : false
   }

   const Student_practical_answer_detail = sequelize.define(alias, cols, config)

   Student_practical_answer_detail.associate = (models) => {
      Student_practical_answer_detail.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_practical_answer_detail.belongsTo(models.Students_practicals_answers,{
         as:'practical_answer_data',
         foreignKey: 'id_students_practicals_answers'
      }),
      Student_practical_answer_detail.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_practical_answer_detail.belongsTo(models.Exams_practicals,{
         as:'exam_data',
         foreignKey: 'id_students'
      }),
      Student_practical_answer_detail.belongsTo(models.Exams_practicals_questions,{
         as:'question_data',
         foreignKey: 'id_exams_practicals_questions'
      })
   }
   
   return Student_practical_answer_detail
}