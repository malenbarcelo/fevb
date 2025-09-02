module.exports = (sequelize, DataTypes) => {

   const alias = "Corses_pl_additional_per_category"

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
      tableName : 'courses_pl_additional_per_category',
      timestamps : false
   }

   const Couse_pl_additional_per_category = sequelize.define(alias, cols, config)
   
   return Couse_pl_additional_per_category
}