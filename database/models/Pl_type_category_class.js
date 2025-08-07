module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_types_categories_classes"

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
      id_categories:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_classes:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_types_categories_classes',
      timestamps : false
   }

   const Pl_type_category_class = sequelize.define(alias, cols, config)

   Pl_type_category_class.associate = (models) => {
      Pl_type_category_class.belongsTo(models.Pl_types,{
         as:'type_data',
         foreignKey: 'id_types'
      }),
      Pl_type_category_class.belongsTo(models.Pl_categories,{
         as:'category_data',
         foreignKey: 'id_categories'
      }),
      Pl_type_category_class.belongsTo(models.Pl_courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      })
      Pl_type_category_class.belongsTo(models.Pl_classes,{
         as:'class_data',
         foreignKey: 'id_classes'
      })
   }
   
   return Pl_type_category_class
}