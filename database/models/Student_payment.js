module.exports = (sequelize, DataTypes) => {

   const alias = "Students_payments"

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
      date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      amount:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'students_payments',
      timestamps : false,
      indexes: [
         {
            unique: true,
            fields: ['id_students', 'amount']
         }
      ]
   }

   const Student_payment = sequelize.define(alias, cols, config)

   Student_payment.associate = (models) => {
      Student_payment.belongsTo(models.Students,{
         as:'student_data',
         foreignKey: 'id_students'
      })
   }
   
   return Student_payment
}