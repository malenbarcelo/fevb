module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_practicals_options"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_exams_practicals_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      option_reference:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      option_text:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      correct_option:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_practicals_options',
      timestamps : false
   }

   const Exam_practical_option = sequelize.define(alias, cols, config)

   return Exam_practical_option
}