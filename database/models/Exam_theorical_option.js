module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_theoricals_options"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_exams_theoricals_questions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      option_reference:{
         type: DataTypes.STRING,
         allowNull: false,
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
      tableName : 'exams_theoricals_options',
      timestamps : false
   }

   const Exam_theorical_option = sequelize.define(alias, cols, config)

   return Exam_theorical_option
}