module.exports = (sequelize, DataTypes) => {

   const alias = "Students_answers"

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
      id_exams:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_version:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      exam_variant:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      attempt_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      start_date:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      end_date:{
         type: DataTypes.STRING,
         allowNull: true,
      },
      status:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      grade:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
   }

   const config = {
      tableName : 'students_answers',
      timestamps : false
   }

   const Student_answer = sequelize.define(alias, cols, config)

   Student_answer.associate = (models) => {
      Student_answer.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_answer.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_answer.belongsTo(models.Exams,{
         as:'exam_data_data',
         foreignKey: 'id_students'
      }),
      Student_answer.hasMany(models.Students_answers_details,{
         as:'answers',
         foreignKey: 'id_students_answers',
         sourceKey:'id'
      })
   }
   
   return Student_answer
}