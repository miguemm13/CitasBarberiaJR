// Script de UN SOLO USO: borra TODAS las tablas de la base de
// PRODUCCIÓN en Render (citas, citas_servicios, clientes, servicios y
// barberos), para que se recreen completamente vacías y limpias la
// próxima vez que arranque el backend (que además siembra de nuevo
// los servicios y el barbero automáticamente).
//
// USO:
//   1. En Render: entra a tu base "barberia-citas-db" -> pestaña
//      "Info" -> copia el valor de "External Database URL"
//      (empieza con postgres://...).
//   2. Abre una terminal en la carpeta backend/ y corre:
//
//      PowerShell:
//        $env:DATABASE_URL="pega-aqui-la-url"; node limpiar-produccion.js
//
//      CMD:
//        set DATABASE_URL=pega-aqui-la-url && node limpiar-produccion.js
//
//   3. Cuando termine, borra este archivo (ya cumplió su propósito).

const { Client } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('Falta la variable DATABASE_URL. Revisa las instrucciones al inicio de este archivo.');
    process.exit(1);
  }

  const cliente = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await cliente.connect();

  console.log('Conectado. Borrando todas las tablas...');
  await cliente.query('DROP TABLE IF EXISTS citas_servicios CASCADE;');
  await cliente.query('DROP TABLE IF EXISTS citas CASCADE;');
  await cliente.query('DROP TABLE IF EXISTS clientes CASCADE;');
  await cliente.query('DROP TABLE IF EXISTS servicios CASCADE;');
  await cliente.query('DROP TABLE IF EXISTS barberos CASCADE;');

  console.log('Listo, base vacía. Reinicia el backend en Render (Manual Deploy -> Restart Service) para que se recree todo desde cero.');
  await cliente.end();
}

main().catch(error => {
  console.error('Error al limpiar la base de producción:', error);
  process.exit(1);
});
