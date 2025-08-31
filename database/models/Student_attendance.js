module.exports = (sequelize, DataTypes) => {

   const alias = "Students_attendance"

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
      year:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      year_week:{
         type: DataTypes.STRING,
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
      shift_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      attended:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_attendance',
      timestamps : false
   }

   const Student_attendance = sequelize.define(alias, cols, config)

   Student_attendance.associate = (models) => {
      Student_attendance.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      })
   }
   
   return Student_attendance
}