module.exports = (sequelize, DataTypes) => {

   const alias = "Students"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_inscriptions:{
         type : DataTypes.INTEGER,
         allowNull: false
      },
      commission_name:{
         type : DataTypes.INTEGER,
         allowNull: false
      },
      cuit_cuil:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      first_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      last_name:{
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
         allowNull: true,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      year_week:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      id_courses_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      company:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      inscription_date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      expiration_date:{
         type: DataTypes.DATE,
         allowNull: true,
      },
      courses_methodology:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      user_name:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      password:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      enabled:{
         type: DataTypes.INTEGER,
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
      Student.belongsTo(models.Inscriptions,{
         as:'inscription_data',
         foreignKey: 'id_inscriptions'
      }),
      Student.hasMany(models.Students_inscriptions,{
         as:'student_inscriptions',
         foreignKey: 'id_students',
         sourceKey:'id'
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