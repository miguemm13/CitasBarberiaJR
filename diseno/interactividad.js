// ------------------------------------------------------------------
// Navegación simple entre "vistas" (equivalente a rutas del asistente)
// ------------------------------------------------------------------
const PASOS = ['vista-servicio', 'vista-fecha-hora', 'vista-cliente', 'vista-confirmacion'];

function irAVista(idVista) {
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
  document.getElementById(idVista).classList.add('activa');

  const tarjeta = document.getElementById('tarjeta-app');
  if (tarjeta) tarjeta.scrollTop = 0;

  const barra = document.getElementById('barra-progreso');
  const indicePaso = PASOS.indexOf(idVista);
  if (indicePaso >= 0) {
    barra.classList.remove('hidden');
    document.getElementById('etiqueta-paso').textContent = `Paso ${indicePaso + 1} de ${PASOS.length}`;
    document.getElementById('barra-progreso-fill').style.width = `${((indicePaso + 1) / PASOS.length) * 100}%`;
  } else {
    barra.classList.add('hidden');
  }

  if (idVista === 'vista-confirmacion') actualizarResumen();
}

// Selección de servicio (única: elegir uno reemplaza la selección anterior)
document.querySelectorAll('.tarjeta-servicio').forEach(tarjeta => {
  tarjeta.addEventListener('click', () => {
    document.querySelectorAll('.tarjeta-servicio').forEach(otra => {
      otra.classList.remove('border-dorado', 'border-2');
    });
    tarjeta.classList.add('border-dorado', 'border-2');
  });
});

// ------------------------------------------------------------------
// Calendario mensual completo
// ------------------------------------------------------------------
const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

let mesMostrado = iniciarMesActual();
let fechaSeleccionada = null; // { iso, etiqueta }

// Formatea una fecha usando año/mes/día LOCALES (a diferencia de
// toISOString(), que convierte a UTC y puede desplazar la fecha un
// día según la zona horaria del navegador).
function formatearFechaIso(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function iniciarMesActual() {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
}

function puedeIrMesAnterior() {
  const hoy = new Date();
  return (
    mesMostrado.getFullYear() > hoy.getFullYear() ||
    (mesMostrado.getFullYear() === hoy.getFullYear() && mesMostrado.getMonth() > hoy.getMonth())
  );
}

function renderizarCalendario() {
  const contenedorCabecera = document.getElementById('cabecera-dias');
  const contenedorGrid = document.getElementById('grid-calendario');
  const etiquetaMes = document.getElementById('etiqueta-mes');
  const botonAnterior = document.getElementById('boton-mes-anterior');
  if (!contenedorGrid) return;

  etiquetaMes.textContent = `${NOMBRES_MESES[mesMostrado.getMonth()]} ${mesMostrado.getFullYear()}`;
  botonAnterior.disabled = !puedeIrMesAnterior();

  contenedorCabecera.innerHTML = NOMBRES_DIAS.map(
    nombre => `<span class="text-[10px] uppercase text-crema/30 py-1">${nombre}</span>`
  ).join('');

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const anio = mesMostrado.getFullYear();
  const mes = mesMostrado.getMonth();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const primerDiaSemana = new Date(anio, mes, 1).getDay();

  const celdas = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push(null);
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const fecha = new Date(anio, mes, dia);
    const esPasado = fecha < hoy;
    const esDomingo = fecha.getDay() === 0; // domingo cerrado, ejemplo
    celdas.push({
      dia,
      iso: formatearFechaIso(fecha),
      etiqueta: `${NOMBRES_DIAS[fecha.getDay()]} ${dia}`,
      habilitado: !esPasado && !esDomingo,
    });
  }

  contenedorGrid.innerHTML = celdas
    .map(celda => {
      if (!celda) return '<span></span>';
      const seleccionada = fechaSeleccionada && fechaSeleccionada.iso === celda.iso;
      const clasesBase = 'aspect-square rounded-lg text-sm font-medium flex items-center justify-center';
      let clases;
      if (seleccionada) clases = `${clasesBase} bg-dorado text-negro-mate font-bold`;
      else if (celda.habilitado) clases = `${clasesBase} bg-gris-carbon border border-white/10 text-crema`;
      else clases = `${clasesBase} opacity-20 cursor-not-allowed`;
      const disabledAttr = celda.habilitado ? '' : 'disabled';
      return `<button type="button" class="${clases}" data-iso="${celda.iso}" data-etiqueta="${celda.etiqueta}" ${disabledAttr}>${celda.dia}</button>`;
    })
    .join('');

  contenedorGrid.querySelectorAll('button[data-iso]:not([disabled])').forEach(boton => {
    boton.addEventListener('click', () => {
      fechaSeleccionada = { iso: boton.dataset.iso, etiqueta: boton.dataset.etiqueta };
      renderizarCalendario();
    });
  });

  // Si todavía no hay selección, elige automáticamente el primer día habilitado
  if (!fechaSeleccionada) {
    const primerHabilitado = celdas.find(c => c && c.habilitado);
    if (primerHabilitado) {
      fechaSeleccionada = { iso: primerHabilitado.iso, etiqueta: primerHabilitado.etiqueta };
      renderizarCalendario();
    }
  }
}

document.getElementById('boton-mes-anterior')?.addEventListener('click', () => {
  if (!puedeIrMesAnterior()) return;
  mesMostrado = new Date(mesMostrado.getFullYear(), mesMostrado.getMonth() - 1, 1);
  renderizarCalendario();
});
document.getElementById('boton-mes-siguiente')?.addEventListener('click', () => {
  mesMostrado = new Date(mesMostrado.getFullYear(), mesMostrado.getMonth() + 1, 1);
  renderizarCalendario();
});

renderizarCalendario();

// Selección de hora
document.querySelectorAll('.hora-slot').forEach(hora => {
  hora.addEventListener('click', () => {
    document.querySelectorAll('.hora-slot').forEach(h => {
      h.classList.remove('bg-dorado', 'text-negro-mate', 'border-dorado');
      h.classList.add('bg-gris-carbon', 'border-white/5');
    });
    hora.classList.remove('bg-gris-carbon', 'border-white/5');
    hora.classList.add('bg-dorado', 'text-negro-mate', 'border-dorado');
  });
});

// Simula el estado "enviando" del botón Confirmar Cita (spinner +
// deshabilitado) igual que en la app real, mientras se crea la cita.
function confirmarCitaDemo() {
  const boton = document.getElementById('boton-confirmar-cita');
  const spinner = document.getElementById('spinner-confirmar-cita');
  const texto = document.getElementById('texto-confirmar-cita');
  boton.disabled = true;
  spinner.classList.remove('hidden');
  texto.textContent = 'Enviando...';

  setTimeout(() => {
    irAVista('vista-exito');
    boton.disabled = false;
    spinner.classList.add('hidden');
    texto.textContent = 'Confirmar Cita';
  }, 700);
}

function actualizarResumen() {
  const servicioSeleccionado = document.querySelector('.tarjeta-servicio.border-dorado');
  const horaSeleccionada = document.querySelector('.hora-slot.bg-dorado');

  if (servicioSeleccionado) {
    document.getElementById('resumen-servicio').textContent = servicioSeleccionado.dataset.servicio;
    document.getElementById('resumen-precio').textContent = '$' + Number(servicioSeleccionado.dataset.precio).toLocaleString('es-CL');
  }
  if (fechaSeleccionada) document.getElementById('resumen-fecha').textContent = fechaSeleccionada.etiqueta;
  if (horaSeleccionada) document.getElementById('resumen-hora').textContent = horaSeleccionada.dataset.hora;

  document.getElementById('resumen-cliente').textContent = document.getElementById('campo-nombre').value || 'Juan Pérez';
}
