module.exports = (sequelize, DataTypes) => {

   const alias = "Students_theoricals_answers_details"

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
      id_students_theoricals_answers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_theoricals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_theoricals_questions:{
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
      tableName : 'students_theoricals_answers_details',
      timestamps : false
   }

   const Student_theorical_answer_detail = sequelize.define(alias, cols, config)

   Student_theorical_answer_detail.associate = (models) => {
      Student_theorical_answer_detail.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_theorical_answer_detail.belongsTo(models.Students_theoricals_answers,{
         as:'theorical_answer_data',
         foreignKey: 'id_students_theoricals_answers'
      }),
      Student_theorical_answer_detail.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_theorical_answer_detail.belongsTo(models.Exams_theoricals,{
         as:'exam_data',
         foreignKey: 'id_students'
      }),
      Student_theorical_answer_detail.belongsTo(models.Exams_theoricals_questions,{
         as:'question_data',
         foreignKey: 'id_exams_theoricals_questions'
      })
   }
   
   return Student_theorical_answer_detail
}