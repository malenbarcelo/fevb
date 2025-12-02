module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_practicals_teachers"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_practicals_teachers',
      timestamps : false
   }

   const Exam_practical_theacher = sequelize.define(alias, cols, config)

   return Exam_practical_theacher
}