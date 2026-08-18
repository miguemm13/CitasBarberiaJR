const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');

/**
 * Modelo: CitaServicio (tabla intermedia de la relación N a N
 * entre Cita y Servicio).
 *
 * Se define explícitamente -en vez de dejar que Sequelize la genere
 * sola a partir de belongsToMany()- para tener nombres de columna
 * predecibles (citaId/servicioId) y una llave primaria compuesta.
 * Dejarlo implícito causaba dos problemas: Sequelize nombraba la
 * columna de Cita como "CitumId" (una rareza de la librería de
 * pluralización) y, tras varios ciclos de sync({ alter: true }) en
 * SQLite, la tabla terminó con un índice único solo en servicioId
 * -en vez de en la combinación (citaId, servicioId)-, lo que
 * impedía agendar dos citas distintas con el mismo servicio.
 */
class CitaServicio extends Model {}

CitaServicio.init(
  {
    citaId: { type: DataTypes.UUID, primaryKey: true },
    servicioId: { type: DataTypes.UUID, primaryKey: true },
  },
  {
    sequelize: secuelize,
    modelName: 'CitaServicio',
    tableName: 'citas_servicios',
    timestamps: true,
  }
);

module.exports = CitaServicio;
