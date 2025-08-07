module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_commissions_shifts"

   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      id_commissions:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      commission:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_classes:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      class:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_shifts:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      shift:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_commissions_shifts',
      timestamps : false
   }

   const Pl_commission_shift = sequelize.define(alias, cols, config)

   Pl_commission_shift.associate = (models) => {
      Pl_commission_shift.belongsTo(models.Pl_commissions,{
         as:'commission_data',
         foreignKey: 'id_classes'
      }),
      Pl_commission_shift.belongsTo(models.Pl_classes,{
         as:'class_data',
         foreignKey: 'id_classes'
      }),
      Pl_commission_shift.belongsTo(models.Pl_shifts,{
         as:'shift_data',
         foreignKey: 'id_shifts'
      })
   }
   
   return Pl_commission_shift
}