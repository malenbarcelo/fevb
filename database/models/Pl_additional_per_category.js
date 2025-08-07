module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_additional_per_category"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      additional:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_additional_per_category',
      timestamps : false
   }

   const Pl_additional_per_category = sequelize.define(alias, cols, config)
   
   return Pl_additional_per_category
}