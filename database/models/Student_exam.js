module.exports = (sequelize, DataTypes) => {

   const alias = "Students_exams"

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
      id_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      practical:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'students_exams',
      timestamps : false
   }

   const Student_exam = sequelize.define(alias, cols, config)

   Student_exam.associate = (models) => {
      Student_exam.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_exam.belongsTo(models.Exams,{
         as:'exam_data',
         foreignKey: 'id_exams'
      }),
      Student_exam.hasMany(models.Students_answers,{
         as:'attempts',
         foreignKey: 'id_students_exams',
         sourceKey:'id'
      })
   }
   
   return Student_exam
}