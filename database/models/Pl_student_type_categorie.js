module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_students_types_categories"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_categories:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_students_types_categories',
      timestamps : false
   }

   const Pl_student_type_category = sequelize.define(alias, cols, config)

   Pl_student_type_category.associate = (models) => {
      Pl_student_type_category.belongsTo(models.Pl_students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Pl_student_type_category.belongsTo(models.Pl_types,{
         as:'type_data',
         foreignKey: 'id_types'
      }),
      Pl_student_type_category.belongsTo(models.Pl_categories,{
         as:'category_data',
         foreignKey: 'id_categories'
      })
   }
   
   return Pl_student_type_category
}