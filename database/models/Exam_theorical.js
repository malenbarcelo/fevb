module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_theoricals"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      exam_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      pass_grade:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      courses_types_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_theoricals',
      timestamps : false
   }

   const Exam_theorical = sequelize.define(alias, cols, config)

   return Exam_theorical
}