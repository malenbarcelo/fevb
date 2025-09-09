module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_prices"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      list_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'courses_prices',
      timestamps : false
   }

   const Course_price = sequelize.define(alias, cols, config)

   Course_price.associate = (models) => {
      Course_price.belongsTo(models.Courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      })
   }
   
   return Course_price
}