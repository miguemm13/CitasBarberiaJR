import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { CitasService } from '../../../../nucleo/servicios/citas.service';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { FechaActualService } from '../../../../nucleo/servicios/fecha-actual.service';
import { HorarioDisponible } from '../../../../modelos/horario-disponible.model';
import { SelectorHorarioComponent } from '../../componentes/selector-horario/selector-horario.component';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';
import { BotonPrimarioComponent } from '../../../../compartido/componentes/boton-primario/boton-primario.component';

interface CeldaCalendario {
  fecha: string | null; // null = celda de relleno, fuera del mes
  numero: number | null;
  habilitado: boolean;
}

const NOMBRES_DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Cada cuánto se refresca el listado de horarios cuando el día
// elegido es hoy, para que las horas ya pasadas se tachen en vivo.
const INTERVALO_ACTUALIZACION_MS = 30000;

/**
 * Paso 2: calendario mensual completo + grid de horas disponibles.
 * Las horas ya ocupadas (o ya pasadas, si el día es hoy) llegan
 * tachadas desde el backend.
 */
@Component({
  selector: 'app-seleccion-fecha-hora',
  standalone: true,
  imports: [CommonModule, SelectorHorarioComponent, BarraProgresoComponent, BotonPrimarioComponent],
  templateUrl: './seleccion-fecha-hora.component.html',
})
export class SeleccionFechaHoraComponent implements OnInit, OnDestroy {
  private readonly citasApi = inject(CitasService);
  private readonly fechaActualApi = inject(FechaActualService);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  readonly nombresDias = NOMBRES_DIAS;

  // "Hoy" por defecto usa el reloj del dispositivo mientras llega la
  // respuesta del backend; en cuanto responde /api/sistema/fecha-actual
  // se reemplaza por la fecha exacta del servidor (ver ngOnInit).
  private hoy = dayjs().startOf('day').toDate();
  private hoyIso = dayjs().format('YYYY-MM-DD');
  private intervaloActualizacion: ReturnType<typeof setInterval> | null = null;
  mesMostrado = this.obtenerPrimerDiaMesActual();
  semanas: CeldaCalendario[][] = [];
  horarios: HorarioDisponible[] = [];

  ngOnInit(): void {
    this.fechaActualApi.obtenerFechaActual().subscribe({
      next: ({ fecha }) => {
        this.hoy = dayjs(fecha).startOf('day').toDate();
        this.hoyIso = fecha;
        this.mesMostrado = this.obtenerPrimerDiaMesActual();
        this.inicializarCalendario();
      },
      // Si el backend no responde, seguimos con el reloj del dispositivo
      // como respaldo para no dejar el paso 2 sin funcionar.
      error: () => this.inicializarCalendario(),
    });
  }

  ngOnDestroy(): void {
    this.detenerActualizacionEnVivo();
  }

  private inicializarCalendario(): void {
    this.generarCalendario();
    const primerDiaHabilitado = this.semanas.flat().find(c => c.habilitado);
    if (primerDiaHabilitado) this.seleccionarDia(primerDiaHabilitado);
  }

  get etiquetaMes(): string {
    return `${NOMBRES_MESES[this.mesMostrado.getMonth()]} ${this.mesMostrado.getFullYear()}`;
  }

  get puedeIrMesAnterior(): boolean {
    return (
      this.mesMostrado.getFullYear() > this.hoy.getFullYear() ||
      (this.mesMostrado.getFullYear() === this.hoy.getFullYear() && this.mesMostrado.getMonth() > this.hoy.getMonth())
    );
  }

  irMesAnterior(): void {
    if (!this.puedeIrMesAnterior) return;
    this.mesMostrado = new Date(this.mesMostrado.getFullYear(), this.mesMostrado.getMonth() - 1, 1);
    this.generarCalendario();
  }

  irMesSiguiente(): void {
    this.mesMostrado = new Date(this.mesMostrado.getFullYear(), this.mesMostrado.getMonth() + 1, 1);
    this.generarCalendario();
  }

  seleccionarDia(celda: CeldaCalendario): void {
    if (!celda.habilitado || !celda.fecha) return;
    this.estado.fechaSeleccionada.set(celda.fecha);
    this.estado.horaSeleccionada.set(null);
    this.cargarHorarios(celda.fecha);
  }

  private cargarHorarios(fecha: string): void {
    this.detenerActualizacionEnVivo();
    this.solicitarHorarios(fecha);

    // Si el día elegido es hoy, las horas se van tachando a medida que
    // pasan, así que se refresca el listado periódicamente para verlo
    // en tiempo real sin tener que recargar la página.
    if (fecha === this.hoyIso) {
      this.intervaloActualizacion = setInterval(() => this.solicitarHorarios(fecha), INTERVALO_ACTUALIZACION_MS);
    }
  }

  private solicitarHorarios(fecha: string): void {
    const duracionMinutos = this.estado.duracionTotalMinutos();
    this.citasApi.obtenerHorariosDisponibles(fecha, duracionMinutos).subscribe(horarios => {
      // Si la respuesta tardó (ej. el backend "despertando" del plan
      // gratuito) y mientras tanto el cliente ya eligió otro día, se
      // descarta: ya no corresponde al día que está viendo en pantalla.
      if (this.estado.fechaSeleccionada() === fecha) {
        this.horarios = horarios;
      }
    });
  }

  private detenerActualizacionEnVivo(): void {
    if (this.intervaloActualizacion !== null) {
      clearInterval(this.intervaloActualizacion);
      this.intervaloActualizacion = null;
    }
  }

  seleccionarHora(hora: string): void {
    this.estado.horaSeleccionada.set(hora);
  }

  continuar(): void {
    this.router.navigate(['/agendar/datos-cliente']);
  }

  private obtenerPrimerDiaMesActual(): Date {
    return new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  }

  private generarCalendario(): void {
    const anio = this.mesMostrado.getFullYear();
    const mes = this.mesMostrado.getMonth();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const primerDiaSemana = new Date(anio, mes, 1).getDay(); // 0 = domingo

    const celdas: CeldaCalendario[] = [];
    for (let i = 0; i < primerDiaSemana; i++) {
      celdas.push({ fecha: null, numero: null, habilitado: false });
    }
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaCelda = new Date(anio, mes, dia);
      const esPasado = fechaCelda < this.hoy;
      // Abierto todos los días de la semana (lunes a lunes), sin día de
      // descanso.
      celdas.push({
        // dayjs().format() usa los componentes locales de la fecha
        // (año/mes/día), a diferencia de toISOString() que convierte a
        // UTC y puede desplazar la fecha un día según la zona horaria
        // del navegador del cliente.
        fecha: dayjs(fechaCelda).format('YYYY-MM-DD'),
        numero: dia,
        habilitado: !esPasado,
      });
    }
    while (celdas.length % 7 !== 0) {
      celdas.push({ fecha: null, numero: null, habilitado: false });
    }

    this.semanas = [];
    for (let i = 0; i < celdas.length; i += 7) {
      this.semanas.push(celdas.slice(i, i + 7));
    }
  }
}
