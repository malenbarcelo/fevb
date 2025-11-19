module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_questions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_version:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      exam_variant:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_questions_types:{
         type: DataTypes.INTEGER,
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
      includes_images:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_questions',
      timestamps : false
   }

   const Exam_question = sequelize.define(alias, cols, config)

   Exam_question.associate = (models) => {
      Exam_question.hasMany(models.Exams_options,{
         as:'question_options',
         foreignKey: 'id_exams_questions',
         sourceKey:'id'
      })
   }

   return Exam_question
}