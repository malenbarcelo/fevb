module.exports = (sequelize, DataTypes) => {

   const alias = "Courses"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      course_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      course_description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_courses_types:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      type_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      type_action:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      category:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      ciu:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },      
      id_exams_theoricals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_practicals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      expiration_time_days:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      course_methodology:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      weeks_to_show:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      allows_bulk_inscriptions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      print_certificate:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      print_credential:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      print_attendance_proof:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }      
   }

   const config = {
      tableName : 'courses',
      timestamps : false
   }

   const Course = sequelize.define(alias, cols, config)

   Course.associate = (models) => {
      Course.belongsTo(models.Courses_types,{
         as:'type_data',
         foreignKey: 'id_courses_types'
      }),
      Course.belongsTo(models.Exams_theoricals,{
         as:'theorical_data',
         foreignKey: 'id_exams_theoricals'
      }),
      Course.belongsTo(models.Exams_practicals,{
         as:'practical_data',
         foreignKey: 'id_exams_practicals'
      })
   }
   
   return Course
}