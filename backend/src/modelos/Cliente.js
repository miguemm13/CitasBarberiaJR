const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');

/**
 * Modelo: Cliente
 * Datos capturados en el paso de datos del cliente del asistente de
 * agendamiento: nombre y apellido, y teléfono (Venezuela, formato
 * local "0412-1234567") para poder recordarle la cita por WhatsApp.
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
    // Se guarda ya normalizado en formato local "0412-1234567" (ver
    // utilidades/telefono-venezuela.js).
    telefono: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: secuelize,
    modelName: 'Cliente',
    tableName: 'clientes',
    timestamps: true,
  }
);

module.exports = Cliente;
