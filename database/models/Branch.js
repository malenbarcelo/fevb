module.exports = (sequelize, DataTypes) => {

   const alias = "Branches"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      branch:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      branch_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      address_line_1:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      address_line_2:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      city:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      branch_url:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      phone_number:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      spreadsheet_id:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'branches',
      timestamps : false
   }

   const Branch = sequelize.define(alias, cols, config)

   Branch.associate = (models) => {
      Branch.hasMany(models.Branches_courses_types,{
         as:'branches_courses_types',
         foreignKey: 'id_branches',
         sourceKey:'id'
      })
   }

   return Branch
}