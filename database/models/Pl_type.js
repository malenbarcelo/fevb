module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_types"

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
      title:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      action:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      alias:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_types',
      timestamps : false
   }

   const Pl_type = sequelize.define(alias, cols, config)
   
   return Pl_type
}