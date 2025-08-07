module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_classes"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      class:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      hours:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_classes',
      timestamps : false
   }

   const Pl_class = sequelize.define(alias, cols, config)

   Pl_class.associate = (models) => {
      Pl_class.belongsTo(models.Pl_courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      })
   }
   
   return Pl_class
}