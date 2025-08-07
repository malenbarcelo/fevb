module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_types_categories_prices"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_categories:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      category:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      price:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_types_categories_prices',
      timestamps : false
   }

   const Pl_type_category_price = sequelize.define(alias, cols, config)

   Pl_type_category_price.associate = (models) => {
      Pl_type_category_price.belongsTo(models.Pl_types,{
         as:'type_data',
         foreignKey: 'id_types'
      }),
      Pl_type_category_price.belongsTo(models.Pl_categories,{
         as:'category_data',
         foreignKey: 'id_categories'
      })
   }
   
   return Pl_type_category_price
}