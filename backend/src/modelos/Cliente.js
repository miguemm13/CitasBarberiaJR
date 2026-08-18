const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');

/**
 * Modelo: Cliente
 * Datos mínimos capturados en el paso de datos del cliente
 * del asistente de agendamiento (solo nombre y apellido).
 */
class Cliente extends Model {}

Cliente.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombreCompleto: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: secuelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
  }
);

module.exports = Cliente;
