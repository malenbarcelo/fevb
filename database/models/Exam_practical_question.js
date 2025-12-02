module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_practicals_questions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_exams_practicals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_practical_version:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_questions_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      stage_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      stage_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      question_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      question:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_practicals_questions',
      timestamps : false
   }

   const Exam_practical_question = sequelize.define(alias, cols, config)

   Exam_practical_question.associate = (models) => {
      Exam_practical_question.hasMany(models.Exams_practicals_options,{
         as:'question_options',
         foreignKey: 'id_exams_practicals_questions',
         sourceKey:'id'
      })
   }

   return Exam_practical_question
}