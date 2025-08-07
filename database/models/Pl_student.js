module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_students"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      cuit:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      email:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      phone_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      year:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      commission_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      commission_number:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_students',
      timestamps : false
   }

   const Pl_student = sequelize.define(alias, cols, config)

   Pl_student.associate = (models) => {
      Pl_student.hasMany(models.Pl_students_types_categories,{
        as:'selection',
        foreignKey: 'id_students',
        sourceKey:'id'
      }),
      Pl_student.hasMany(models.Pl_students_attendance,{
        as:'attendance',
        foreignKey: 'id_students',
        sourceKey:'id'
      })
   }

   return Pl_student
}