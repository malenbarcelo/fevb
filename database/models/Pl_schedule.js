module.exports = (sequelize, DataTypes) => {

   const alias = "Pl_schedule"

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
      commission_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      commission_number:{
         type: DataTypes.INTEGER,
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
      },
      day_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      day:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      time:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      shift_M:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      shift_T:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      year:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      week_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      date_string:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'pl_schedule',
      timestamps : false
   }

   const Pl_schedule = sequelize.define(alias, cols, config)

   Pl_schedule.associate = (models) => {
      Pl_schedule.belongsTo(models.Pl_commissions,{
         as:'commission_data',
         foreignKey: 'id_classes'
      }),
      Pl_schedule.belongsTo(models.Pl_classes,{
         as:'class_data',
         foreignKey: 'id_classes'
      }),
      Pl_schedule.belongsTo(models.Pl_shifts,{
         as:'shift_data',
         foreignKey: 'id_shifts'
      })
   }
   
   return Pl_schedule
}