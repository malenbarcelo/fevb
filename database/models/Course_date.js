module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_dates"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      year:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      month:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      day:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      date_string:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses_dates',
      timestamps : false
   }

   const Course_date = sequelize.define(alias, cols, config)

   return Course_date
}