module.exports = (sequelize, DataTypes) => {

   const alias = "Courses_schedule"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      course_description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_branches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      day:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      shift_alias:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      day_shift:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      duration_hours:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      commission_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      weeks:{
         type: DataTypes.STRING,
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
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'courses_schedule',
      timestamps : false
   }

   const Course_schedule = sequelize.define(alias, cols, config)

   Course_schedule.associate = (models) => {
      Course_schedule.belongsTo(models.Courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      })
   }
   
   return Course_schedule
}