const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');
const Barbero = require('./Barbero');
const Cliente = require('./Cliente');
const Servicio = require('./Servicio');
const CitaServicio = require('./CitaServicio');

/**
 * Modelo: Cita
 * Entidad principal del dominio. Relaciona cliente, barbero y
 * uno o más servicios en un bloque de fecha/hora.
 */
class Cita extends Model {}

Cita.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.STRING, allowNull: false }, // 'HH:mm'
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
      defaultValue: 'pendiente',
    },
    notaAdicional: { type: DataTypes.STRING, allowNull: true },
    precioTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    sequelize: secuelize,
    modelName: 'Cita',
    tableName: 'citas',
    timestamps: true,
  }
);

// --- Asociaciones (relaciones entre modelos) ---
Cita.belongsTo(Barbero, { foreignKey: 'barberoId', as: 'barbero' });
Cita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
// Llaves foráneas explícitas (citaId/servicioId) vía el modelo
// CitaServicio, en vez de dejar que Sequelize las adivine (ver
// comentario en modelos/CitaServicio.js).
Cita.belongsToMany(Servicio, {
  through: CitaServicio,
  as: 'servicios',
  foreignKey: 'citaId',
  otherKey: 'servicioId',
});

module.exports = Cita;
