module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_pl_categories"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      category:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      category_type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses_pl_categories',
      timestamps : false
   }

   const Course_pl_category = sequelize.define(alias, cols, config)
   
   return Course_pl_category
}