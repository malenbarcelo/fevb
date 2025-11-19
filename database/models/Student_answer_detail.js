module.exports = (sequelize, DataTypes) => {

   const alias = "Students_answers_details"

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
      id_students_answers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      ids_selected_options:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      ids_correct_options:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      correct_answer:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_answers_details',
      timestamps : false
   }

   const Student_answer_detail = sequelize.define(alias, cols, config)

   Student_answer_detail.associate = (models) => {
      Student_answer_detail.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_answer_detail.belongsTo(models.Students_answers,{
         as:'student_answer_data',
         foreignKey: 'id_students_answers'
      }),
      Student_answer_detail.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_answer_detail.belongsTo(models.Exams,{
         as:'exam_data_data',
         foreignKey: 'id_students'
      }),
      Student_answer_detail.belongsTo(models.Exams_questions,{
         as:'question_data',
         foreignKey: 'id_exams_questions'
      })
   }
   
   return Student_answer_detail
}