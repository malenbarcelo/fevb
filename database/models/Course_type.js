module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_types"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses_types',
      timestamps : false
   }

   const Course_type = sequelize.define(alias, cols, config)
   
   return Course_type
}