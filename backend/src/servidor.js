const app = require('./app');
const secuelize = require('./config/base-datos');
const variablesEntorno = require('./config/variables-entorno');
const { sembrarDatosIniciales } = require('./semillas');
const { iniciarRecordatorios } = require('./servicios/recordatorio.servicio');
require('./modelos'); // registra los modelos y sus asociaciones

async function iniciar() {
  try {
    await secuelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');

    // Crea las tablas que todavía no existan (en desarrollo y en
    // producción). A propósito NO se usa sync({ alter: true }): en
    // SQLite, "alter" reconstruye la tabla por detrás (crea una copia
    // con la nueva estructura, copia los datos, borra la original y
    // renombra la copia). Es un proceso de varios pasos que, con el
    // servidor reiniciándose constantemente en desarrollo, termina
    // fallando a mitad de camino tarde o temprano y deja la base
    // corrupta.
    //
    // sync() sin alter es mucho más simple y seguro: solo crea las
    // tablas que faltan, nunca toca las que ya existen -por eso es
    // seguro dejarlo corriendo también en producción, incluso en cada
    // despliegue-. Si cambias un modelo (agregas un campo, cambias una
    // relación...) en desarrollo, hay que borrar el archivo
    // backend/barberia_citas.sqlite una vez y reiniciar -es seguro
    // porque son solo datos de prueba, y sembrarDatosIniciales() los
    // vuelve a crear automáticamente-. En producción, ese mismo cambio
    // requiere una migración manual (sequelize-cli) porque ya hay datos
    // reales que no se pueden simplemente borrar.
    await secuelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    // Crea el barbero y los servicios iniciales si todavía no existen,
    // así no hay que cargar nada a mano antes de usar la app.
    await sembrarDatosIniciales();

    // Revisor periódico de recordatorios (avisa al barbero ~1h antes
    // de cada cita, con botón para reenviar por WhatsApp).
    iniciarRecordatorios();

    app.listen(variablesEntorno.puerto, () => {
      console.log(`Servidor de Barbería Citas escuchando en el puerto ${variablesEntorno.puerto}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciar();
