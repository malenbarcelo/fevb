module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_courses"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      course:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_courses',
      timestamps : false
   }

   const Pl_course = sequelize.define(alias, cols, config)

   return Pl_course
}