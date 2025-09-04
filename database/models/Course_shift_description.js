module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_shifts_descriptions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      shift:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      shift_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses_shifts_descriptions',
      timestamps : false
   }

   const Course_shift_description = sequelize.define(alias, cols, config)
   
   return Course_shift_description
}