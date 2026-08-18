const { Sequelize } = require('sequelize');
const variablesEntorno = require('./variables-entorno');

/**
 * Instancia única de conexión a la base de datos. Se reutiliza en
 * todos los modelos. El dialecto es configurable por entorno:
 * - sqlite (por defecto en desarrollo, no requiere instalar nada)
 * - postgres (recomendado en producción)
 */
const esSqlite = variablesEntorno.baseDatos.dialecto === 'sqlite';
const esProduccion = variablesEntorno.entorno === 'production';

const secuelize = new Sequelize({
  dialect: variablesEntorno.baseDatos.dialecto,
  storage: esSqlite ? variablesEntorno.baseDatos.almacenamiento : undefined,
  host: esSqlite ? undefined : variablesEntorno.baseDatos.host,
  port: esSqlite ? undefined : variablesEntorno.baseDatos.puerto,
  database: esSqlite ? undefined : variablesEntorno.baseDatos.nombre,
  username: esSqlite ? undefined : variablesEntorno.baseDatos.usuario,
  password: esSqlite ? undefined : variablesEntorno.baseDatos.clave,
  // Render (y la mayoría de proveedores) exigen SSL para conectarse a
  // Postgres en producción. rejectUnauthorized: false evita que falle
  // por el certificado autofirmado que usan estos proveedores.
  dialectOptions: !esSqlite && esProduccion ? { ssl: { require: true, rejectUnauthorized: false } } : undefined,
  logging: false,
});

module.exports = secuelize;
