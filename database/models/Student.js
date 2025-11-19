module.exports = (sequelize, DataTypes) => {

   const alias = "Students"

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
      id_courses_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'students',
      timestamps : false
   }

   const Student = sequelize.define(alias, cols, config)

   Student.associate = (models) => {
      Student.belongsTo(models.Courses_types,{
         as:'course_type_data',
         foreignKey: 'id_courses_types'
      }),
      Student.hasMany(models.Students_exams,{
         as:'student_exams',
         foreignKey: 'id_students',
         sourceKey:'id'
      }),
      Student.hasMany(models.Students_attendance,{
         as:'attendance',
         foreignKey: 'id_students',
         sourceKey:'id'
      }),
      Student.hasMany(models.Students_payments,{
         as:'payments',
         foreignKey: 'id_students',
         sourceKey:'id'
      })
   }

   return Student
}