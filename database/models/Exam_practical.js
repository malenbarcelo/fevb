module.exports = (sequelize, DataTypes) => {

   const alias = "Exams_practicals"

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
      courses_types_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      index:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      hierarchy:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'exams_practicals',
      timestamps : false
   }

   const Exam_practical = sequelize.define(alias, cols, config)

   return Exam_practical
}