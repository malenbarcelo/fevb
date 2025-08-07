module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_shifts"

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
      day:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      time:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_shifts',
      timestamps : false
   }

   const Pl_shift = sequelize.define(alias, cols, config)

   return Pl_shift
}