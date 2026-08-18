const { DataTypes, Model } = require('sequelize');
const secuelize = require('../config/base-datos');

/**
 * Modelo: Barbero
 * Representa a un profesional que atiende citas en la barbería.
 */
class Barbero extends Model {}

Barbero.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombreCompleto: { type: DataTypes.STRING, allowNull: false },
    especialidad: { type: DataTypes.STRING, allowNull: true },
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
    // Chat id de Telegram del barbero (o de un grupo) donde recibirá
    // el aviso de nuevas citas. Si está vacío, se usa el chat general
    // definido en TELEGRAM_CHAT_ID_BARBERIA.
    telegramChatId: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize: secuelize,
    modelName: 'Barbero',
    tableName: 'barberos',
    timestamps: true,
  }
);

module.exports = Barbero;
