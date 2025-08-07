module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_students_attendance"

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
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      year:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      date_string:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      shift:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      attended:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_students_attendance',
      timestamps : false
   }

   const Pl_student_attendance = sequelize.define(alias, cols, config)

   Pl_student_attendance.associate = (models) => {
      Pl_student_attendance.belongsTo(models.Pl_students,{
         as:'student_data',
         foreignKey: 'id_students'
      })
   }
   
   return Pl_student_attendance
}