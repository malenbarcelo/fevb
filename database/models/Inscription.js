module.exports = (sequelize, DataTypes) => {

   const alias = "Inscriptions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      inscription_type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      first_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      last_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      email:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      phone_number:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      company:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      inscription_date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'inscriptions',
      timestamps : false
   }

   const Inscription = sequelize.define(alias, cols, config)
   
   return Inscription

}