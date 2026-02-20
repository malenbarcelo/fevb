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
      id_exams_theoricals:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_theorical_version:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_theorical_variant:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_exams_practicals:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
      exam_practical_version:{
         type: DataTypes.INTEGER,
         allowNull: true,
      },
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
      Student_exam.belongsTo(models.Exams_theoricals,{
         as:'exam_theorical_data',
         foreignKey: 'id_exams_theoricals'
      }),
      Student_exam.belongsTo(models.Exams_practicals,{
         as:'exam_practical_data',
         foreignKey: 'id_exams_practicals'
      }),
      Student_exam.hasMany(models.Students_exams_theoricals_answers,{
         as:'theoricals_answers',
         foreignKey: 'id_students_exams',
         sourceKey:'id'
      }),
      Student_exam.hasMany(models.Students_exams_practicals_answers,{
         as:'practicals_answers',
         foreignKey: 'id_students_exams',
         sourceKey:'id'
      })
   }
   
   return Student_exam
}