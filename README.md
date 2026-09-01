# Barbería Citas — Diseño y Arquitectura

Aplicación web móvil-first de agendamiento de citas para una barbería moderna. Tema oscuro azul marino con acentos plateados, flujo de cliente en 4 pasos y panel de administración para el barbero.

## Estructura del proyecto

```
BarberiaCitas/
├── diseno/                  # Prototipo visual HTML + Tailwind (referencia de diseño)
│   └── index.html           # Flujo completo: hero, 4 pasos, éxito y panel admin
├── frontend/                 # Aplicación Angular (cliente)
└── backend/                  # API Node.js + Express (arquitectura MVC)
```

El archivo `diseno/index.html` se puede abrir directamente en el navegador: es la referencia visual pixel-a-pixel de la que se derivan los componentes Angular. Usa la misma paleta, tipografía y espaciados definidos en `frontend/tailwind.config.js`.

## Paleta de diseño

| Uso | Color |
|---|---|
| Fondo principal | Azul marino `#081f37` |
| Superficies / tarjetas | Azul marino claro `#0F2C4D` |
| Acento principal (botones) | Plata `#C7D0DC` (texto azul marino sobre este color) |
| Fondo detrás de la tarjeta centrada | `#04101F` |
| Texto | Blanco / grises translúcidos |

Tipografía: **Inter** (texto general) + **Playfair Display** (títulos, look de barbería premium).

## Frontend — Angular

Arquitectura por módulos con capa de modelos (Modelo), componentes/páginas (Vista) y servicios (Controlador del lado cliente, que consumen la API):

```
frontend/src/app/
├── modelos/                          # Interfaces TypeScript (Servicio, Barbero, Cliente, Cita...)
├── nucleo/
│   ├── servicios/                    # Llamadas HTTP a la API + estado del asistente (signals)
│   └── interceptores/                # Manejo global de errores HTTP
├── compartido/
│   ├── componentes/                  # BarraProgreso, BotonPrimario (reutilizables)
│   └── pipes/                        # monedaClp
├── modulos/
│   ├── agendamiento/                 # Flujo del cliente (pasos 1-4)
│   │   ├── paginas/                  # inicio, seleccion-servicio, seleccion-fecha-hora,
│   │   │                             #   datos-cliente, confirmacion, exito
│   │   ├── componentes/              # tarjeta-servicio, selector-horario
│   │   └── agendamiento.routes.ts
│   └── panel-admin/                  # Vista del barbero
│       ├── paginas/agenda-diaria/
│       ├── componentes/tarjeta-cita/
│       └── panel-admin.routes.ts
├── app.routes.ts                     # Enrutamiento raíz (lazy loading por módulo)
├── app.config.ts
└── app.component.ts
```

Cada paso del asistente es una página independiente con su propia ruta (`/agendar/servicio`, `/agendar/fecha-hora`, etc.), lo que permite deep-linking y facilita agregar o quitar pasos sin tocar el resto del flujo. El estado compartido entre pasos (servicios elegidos, fecha/hora, cliente) vive en `AgendamientoEstadoService` usando signals de Angular. Por ahora no hay paso de selección de barbero porque la barbería solo tiene uno (Javier Revette); el backend lo asigna automáticamente. Si en el futuro se suman más barberos, existe `paginas/seleccion-barbero` ya construido pero sin conectar a las rutas — solo hay que volver a agregarlo a `agendamiento.routes.ts`.

### Escalabilidad del frontend

Agregar un nuevo módulo (por ejemplo, "reseñas" o "programa de fidelidad") significa crear una carpeta nueva bajo `modulos/` con su propio `paginas/`, `componentes/` y archivo `*.routes.ts`, y registrarla con `loadChildren` en `app.routes.ts` — sin modificar los módulos existentes.

## Backend — Node.js (MVC)

```
backend/src/
├── modelos/              # Modelo: entidades Sequelize (Cita, Servicio, Barbero, Cliente)
├── controladores/         # Controlador: lógica de cada endpoint
├── rutas/                 # Definición de endpoints Express, agrupados por recurso
├── servicios/              # Lógica de negocio reutilizable (disponibilidad, Telegram)
├── middlewares/            # validar-cita, manejador-errores
├── config/                 # base-datos.js, variables-entorno.js
├── app.js                  # Configuración de Express (sin iniciar servidor)
└── servidor.js              # Punto de entrada: conecta DB y levanta el servidor
```

La capa "Vista" del patrón MVC tradicional del backend es aquí el JSON que cada controlador retorna al frontend Angular (API REST desacoplada, sin motor de plantillas del lado servidor).

### Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/servicios` | Lista servicios activos (Paso 1) |
| GET | `/api/barberos` | Lista barberos disponibles (no usado en el flujo actual, listo para cuando haya más de uno) |
| GET | `/api/citas/disponibilidad?fecha=&barberoId=` | Horarios libres/ocupados, de 10am a 8pm (Paso 2) |
| POST | `/api/citas` | Crea la cita y notifica al barbero por Telegram (Paso 4) |
| GET | `/api/citas/agenda?fecha=` | Agenda diaria del barbero (panel admin) |
| PATCH | `/api/citas/:id/estado` | Cambia estado: pendiente/completada/cancelada |

### Notificación al barbero por Telegram

Cuando el cliente confirma una cita (Paso 4), el backend le avisa al barbero por Telegram — es el único canal de notificación (no se usa WhatsApp). Esto ocurre en `controladores/citas.controlador.js`, que llama a `servicios/telegram.servicio.js`.

**Paso a paso para configurarlo (una sola vez):**

1. Abre Telegram y busca el usuario `@BotFather`.
2. Envíale el comando `/newbot`.
3. Te pedirá un nombre para mostrar (ej. "Barbería Nº7 Bot") y un usuario único que debe terminar en `bot` (ej. `barberia_n7_bot`).
4. BotFather te entrega un **token** con este formato: `123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. Cópialo en `backend/.env`, en la variable `TELEGRAM_BOT_TOKEN`.
5. Ahora necesitas el **chat id** de a dónde llegarán los avisos. Dos formas:
   - **Chat directo con el barbero:** el barbero le escribe cualquier mensaje al bot (ej. "hola") desde su cuenta de Telegram. Luego, desde el navegador, visita `https://api.telegram.org/bot<TU_TOKEN>/getUpdates` (reemplaza `<TU_TOKEN>` por el token real) y busca el campo `"chat":{"id": ...}` en la respuesta JSON — ese número es el chat id.
   - **Grupo con todos los barberos:** crea un grupo de Telegram, agrega el bot como miembro, escribe cualquier mensaje en el grupo, y repite el paso de `getUpdates` — el chat id de un grupo es un número negativo (ej. `-1001234567890`).
6. Pega ese chat id en `backend/.env`, en `TELEGRAM_CHAT_ID_BARBERIA` (sirve como chat de respaldo para todos los barberos).
7. Opcional: si el barbero quiere recibir los avisos en su propio chat (en vez de un grupo compartido), guarda su chat id individual en el campo `telegramChatId` (vía `PUT /api/barberos/:id` o editando `src/semillas.js`, que se aplica automáticamente al reiniciar el servidor). Si no tiene `telegramChatId`, se usa el chat general.
8. Reinicia el backend (`npm run dev`) para que tome las variables nuevas.

Si `TELEGRAM_BOT_TOKEN` o el chat id no están configurados, la cita se crea igual — el envío del mensaje simplemente se omite y queda un aviso en la consola del servidor.

### Escalabilidad del backend

Nuevos recursos (ej. "promociones", "reseñas") siguen el mismo patrón: un modelo en `modelos/`, su controlador en `controladores/`, su archivo de rutas en `rutas/` registrado en `rutas/index.js`, y la lógica de negocio compleja aislada en `servicios/`.

### Datos iniciales (barbero y servicios)

No hace falta cargar nada a mano: `src/semillas.js` define el barbero y los servicios de la barbería, y `servidor.js` los crea automáticamente cada vez que arranca (si ya existen, no los duplica). Por ahora son:

- Barbero: **Javier Revette**
- Servicio: **Corte de Cabello** ($10, ~45 min)

Para agregar más barberos o servicios, edítalos directamente en `backend/src/semillas.js` y reinicia el servidor. Al reiniciar, cualquier barbero o servicio que ya no esté en esas listas se borra automáticamente, así no quedan datos de pruebas anteriores.

### Datos del cliente

El formulario del Paso 3 solo pide **nombre y apellido**, más una nota opcional — no se pide teléfono. El modelo `Cliente` en el backend ya no tiene campo `telefono`.

### Horario de atención

Fijo por ahora en `servicios/disponibilidad.servicio.js`: de **10:00 a 20:00** (10am a 8pm), en bloques de **1 hora** (un turno por cita). Las horas de la tarde se muestran en formato de 12 horas sin am/pm (13:00 se ve como "1:00", 14:00 como "2:00", etc.) — no genera ambigüedad porque ese rango horario nunca repite un mismo número entre la mañana y la tarde.

Las horas ya pasadas del día de hoy se tachan automáticamente usando la hora de **Venezuela** (`America/Caracas`, ver `src/utilidades/hora-venezuela.js`), sin importar en qué zona horaria esté corriendo el servidor (ej. Render usa UTC).

## Cómo conectar todo

1. `backend`: `npm install` y `npm run dev`. Por defecto usa **SQLite** (un archivo local `barberia_citas.sqlite`, sin instalar nada) y crea automáticamente el barbero y los servicios iniciales. Para producción, cambia `DB_DIALECTO=postgres` en `.env` y completa las credenciales.
2. `frontend`: `npm install`, ajustar `apiUrl` en `src/environments/environment.ts` si el backend no corre en `localhost:3000`, `npm start`.
3. El prototipo `diseno/index.html` no requiere instalación: sirve como referencia visual y como guía de clases Tailwind para portar a los templates Angular.

## Subir a GitHub y desplegar en Render

### 1. Antes de subirlo: revisa los secretos

`backend/.env` tiene el token real del bot de Telegram y **no debe subirse a git** — `backend/.gitignore` ya lo ignora, así que con seguir los pasos de abajo tal cual, no se sube. `backend/.env.example` sí se sube, pero solo tiene los nombres de las variables, sin valores reales.

Como el token del bot se compartió en esta conversación, es buena práctica (no obligatorio) regenerarlo una vez que el proyecto esté funcionando: en Telegram, háblale a `@BotFather` con el comando `/revoke` sobre tu bot para generar uno nuevo, y actualiza `TELEGRAM_BOT_TOKEN` donde corresponda (`.env` local y las variables de entorno en Render).

### 2. Subir el proyecto a GitHub

Desde la carpeta raíz `BarberiaCitas/` (la que contiene `frontend/`, `backend/` y `diseno/`):

```bash
git init
git add .
git commit -m "Primera versión de Barbería Citas"
```

Verifica que `.env` NO aparezca en la lista de `git status` antes de hacer commit. Si por error aparece, revisa que exista `backend/.gitignore` con la línea `.env`.

Luego, en GitHub, crea un repositorio nuevo vacío (sin README ni .gitignore, para no generar conflictos) y conéctalo:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/barberia-citas.git
git push -u origin main
```

### 3. Desplegar en Render

Este repo incluye `render.yaml` en la raíz, que describe los 3 servicios que necesita el proyecto (backend, base de datos Postgres y frontend). Es la forma más simple de desplegar:

1. En [Render](https://dashboard.render.com), click **New +** → **Blueprint**.
2. Conecta tu cuenta de GitHub y selecciona el repositorio `barberia-citas`.
3. Render detecta `render.yaml` automáticamente y muestra los 3 recursos a crear: `barberia-citas-backend` (Web Service), `barberia-citas-db` (PostgreSQL) y `barberia-citas-frontend` (Static Site).
4. Antes de confirmar, Render te pedirá completar las variables marcadas como secretas: `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID_BARBERIA` (los mismos valores de tu `backend/.env`). `CORS_ORIGEN` puedes dejarla vacía por ahora.
5. Click **Apply**. Render crea la base de datos, instala dependencias y levanta el backend y el frontend (tarda unos minutos).

Al terminar, tendrás dos URLs tipo `https://barberia-citas-backend.onrender.com` y `https://barberia-citas-frontend.onrender.com`.

**Paso final obligatorio:** copia la URL del backend y pégala en `frontend/src/environments/environment.prod.ts` (campo `apiUrl`, agregando `/api` al final), y opcionalmente en la variable `CORS_ORIGEN` del backend en el dashboard de Render (con la URL del frontend, para que solo ese dominio pueda llamar a la API). Haz commit y push del cambio — Render vuelve a desplegar el frontend automáticamente con cada push a `main`.

**Nota sobre el plan gratuito de Render:** el backend "se duerme" tras 15 minutos sin tráfico y tarda ~1 minuto en despertar con la primera visita; la base de datos Postgres gratuita expira 30 días después de creada (con 14 días de gracia para pasar a un plan pago antes de perder los datos). Para un proyecto en producción real, conviene revisar los planes pagos de Render antes de lanzarlo.

Si prefieres no usar el Blueprint, los mismos 3 servicios se pueden crear a mano desde el dashboard de Render (New + → Web Service / PostgreSQL / Static Site), usando los mismos valores que están en `render.yaml` como referencia (build command, start command, variables de entorno).
