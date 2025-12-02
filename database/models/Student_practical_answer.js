module.exports = (sequelize, DataTypes) => {

   const alias = "Students_practicals_answers"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_students_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_students:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_teachers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_exams_practicals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_practical_version:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      status:{
         type: DataTypes.STRING,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_practicals_answers',
      timestamps : false
   }

   const Student_practical_answer = sequelize.define(alias, cols, config)

   Student_practical_answer.associate = (models) => {
      Student_practical_answer.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_practical_answer.belongsTo(models.Exams_practicals_teachers,{
         as:'teacher_data',
         foreignKey: 'id_teachers'
      })
   }
   
   return Student_practical_answer
}