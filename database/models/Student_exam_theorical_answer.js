module.exports = (sequelize, DataTypes) => {

   const alias = "Students_exams_theoricals_answers"

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
      id_exams_theoricals_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      ids_selected_options:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      date:{
         type: DataTypes.DATE,
         allowNull: true,
      }
   }

   const config = {
      tableName : 'Students_exams_theoricals_answers',
      timestamps : false
   }

   const Student_exam_theorical_answer = sequelize.define(alias, cols, config)

   Student_exam_theorical_answer.associate = (models) => {
      Student_exam_theorical_answer.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_exam_theorical_answer.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_exam_theorical_answer.belongsTo(models.Exams_theoricals_questions,{
         as:'question_data',
         foreignKey: 'id_exams_theoricals_questions'
      })
   }
   
   return Student_exam_theorical_answer
}