require('dotenv').config();

/**
 * Centraliza el acceso a variables de entorno (.env) con valores
 * por defecto seguros para desarrollo local.
 */
module.exports = {
  // Render (y la mayoría de plataformas de hosting) inyectan el puerto
  // a usar en la variable de entorno estándar PORT, no PUERTO. Se
  // revisan ambas para que funcione igual en local y en producción.
  puerto: process.env.PORT || process.env.PUERTO || 3000,
  entorno: process.env.NODE_ENV || 'development',
  baseDatos: {
    // Por defecto usa SQLite (un archivo local, sin instalar nada).
    // Para producción, cambia DB_DIALECTO=postgres y completa las
    // credenciales de abajo.
    dialecto: process.env.DB_DIALECTO || 'sqlite',
    almacenamiento: process.env.DB_ALMACENAMIENTO || './barberia_citas.sqlite',
    host: process.env.DB_HOST || 'localhost',
    puerto: process.env.DB_PUERTO || 5432,
    nombre: process.env.DB_NOMBRE || 'barberia_citas',
    usuario: process.env.DB_USUARIO || 'postgres',
    clave: process.env.DB_CLAVE || 'postgres',
  },
  telegram: {
    tokenBot: process.env.TELEGRAM_BOT_TOKEN || '',
    // Chat id de respaldo (ej. un grupo con todos los barberos) usado
    // cuando el barbero de la cita no tiene su propio chat id configurado.
    chatIdGeneral: process.env.TELEGRAM_CHAT_ID_BARBERIA || '',
  },
  // Dominio(s) del frontend permitidos para hacer peticiones a esta API
  // (separados por coma si son varios). Si se deja vacío, se permite
  // cualquier origen -cómodo en desarrollo, pero en producción conviene
  // definirlo con la URL real del frontend en Render-.
  corsOrigen: process.env.CORS_ORIGEN ? process.env.CORS_ORIGEN.split(',').map(s => s.trim()) : null,
};
