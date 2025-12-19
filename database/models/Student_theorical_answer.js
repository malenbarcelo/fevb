module.exports = (sequelize, DataTypes) => {

   const alias = "Students_theoricals_answers"

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
      tableName : 'students_theoricals_answers',
      timestamps : false
   }

   const Student_theorical_answer = sequelize.define(alias, cols, config)

   Student_theorical_answer.associate = (models) => {
      Student_theorical_answer.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      }),
      Student_theorical_answer.hasMany(models.Students_theoricals_answers_details,{
         as:'theoricals_answers_details',
         foreignKey: 'id_students_theoricals_answers',
         sourceKey:'id'
      })
   }
   
   return Student_theorical_answer
}