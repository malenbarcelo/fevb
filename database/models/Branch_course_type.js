module.exports = (sequelize, DataTypes) => {

   const alias = "Branches_courses_types"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_branches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      branch_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_courses_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'branches_courses_types',
      timestamps : false
   }

   const Branch_course_type = sequelize.define(alias, cols, config)

   Branch_course_type.associate = (models) => {
      Branch_course_type.belongsTo(models.Branches,{
         as:'branch_data',
         foreignKey: 'id_branches'
      }),
      Branch_course_type.belongsTo(models.Courses_types,{
         as:'course_type_data',
         foreignKey: 'id_courses_types'
      })
   }

   return Branch_course_type
}