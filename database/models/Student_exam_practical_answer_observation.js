module.exports = (sequelize, DataTypes) => {

   const alias = "Students_exams_practicals_answers_observations"

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
      observation_type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      observation:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      stage_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_exams_practicals_answers_observations',
      timestamps : false
   }

   const Student_exam_practical_answer_observation = sequelize.define(alias, cols, config)

   Student_exam_practical_answer_observation.associate = (models) => {
      Student_exam_practical_answer_observation.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      })
   }
   
   return Student_exam_practical_answer_observation
}