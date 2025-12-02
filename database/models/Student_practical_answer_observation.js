module.exports = (sequelize, DataTypes) => {

   const alias = "Students_practicals_answers_observations"

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
      id_students_practicals_answers:{
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
      tableName : 'students_practicals_answers_observations',
      timestamps : false
   }

   const Student_practical_answer_observation = sequelize.define(alias, cols, config)

   Student_practical_answer_observation.associate = (models) => {
      Student_practical_answer_observation.belongsTo(models.Students_exams,{
         as:'student_exam_data',
         foreignKey: 'id_students_exams'
      }),
      Student_practical_answer_observation.belongsTo(models.Students_practicals_answers,{
         as:'practical_answer_data',
         foreignKey: 'id_students_practicals_answers'
      })
   }
   
   return Student_practical_answer_observation
}