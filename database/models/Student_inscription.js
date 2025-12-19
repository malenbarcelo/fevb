module.exports = (sequelize, DataTypes) => {

   const alias = "Students_inscriptions"

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
      id_courses:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_inscriptions',
      timestamps : false
   }

   const Student_inscription = sequelize.define(alias, cols, config)

   Student_inscription.associate = (models) => {
      Student_inscription.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_inscription.belongsTo(models.Courses,{
         as:'course_data',
         foreignKey: 'id_courses'
      })
   }
   
   return Student_inscription
}