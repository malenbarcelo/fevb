module.exports = (sequelize, DataTypes) => {

   const alias = "Courses"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      course_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      course_description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_courses_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      type_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      type_action:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      category:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      ciu:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      practical:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses',
      timestamps : false
   }

   const Course = sequelize.define(alias, cols, config)

   Course.associate = (models) => {
      Course.belongsTo(models.Courses_types,{
         as:'type_data',
         foreignKey: 'id_courses_types'
      })
   }
   
   return Course
}