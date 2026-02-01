module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_theoricals_questions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_exams_theoricals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_theorical_version:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      exam_theorical_variant:{
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
      }
   }

   const config = {
      tableName : 'exams_theoricals_questions',
      timestamps : false
   }

   const Exam_theorical_question = sequelize.define(alias, cols, config)

   Exam_theorical_question.associate = (models) => {
      Exam_theorical_question.hasMany(models.Exams_theoricals_options,{
         as:'question_options',
         foreignKey: 'id_exams_theoricals_questions',
         sourceKey:'id'
      })
   }

   return Exam_theorical_question
}