module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_dates"

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
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      day:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      date_string:{
         type: DataTypes.STRING,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_dates',
      timestamps : false
   }

   const Pl_date = sequelize.define(alias, cols, config)

   return Pl_date
}