module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_commissions"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_classes:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      class:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      commission_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      commission_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'pl_commissions',
      timestamps : false
   }

   const Pl_commission = sequelize.define(alias, cols, config)

   Pl_commission.associate = (models) => {
      Pl_commission.belongsTo(models.Pl_classes,{
         as:'class_data',
         foreignKey: 'id_classes'
      }),
      Pl_commission.hasMany(models.Pl_commissions_shifts,{
         as:'shifts_data',
         foreignKey: 'id_commissions',
         sourceKey:'id'
      })
   }
   
   return Pl_commission
}