const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');

/**
 * Modelo: Servicio
 * Representa un servicio ofrecido por la barbería (corte, barba, combo, etc.)
 */
class Servicio extends Model {}

Servicio.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: true },
    duracionMinutos: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    icono: { type: DataTypes.STRING, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize: secuelize,
    modelName: 'Servicio',
    tableName: 'servicios',
    timestamps: true,
  }
);

module.exports = Servicio;
