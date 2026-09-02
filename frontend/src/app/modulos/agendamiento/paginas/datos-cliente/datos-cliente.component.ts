import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';
import { BotonPrimarioComponent } from '../../../../compartido/componentes/boton-primario/boton-primario.component';

// Formato venezolano: 0 + operadora (412/414/416/424/426) + 7 dígitos,
// con guion o espacio opcional después de la operadora.
// Ej. válidos: 04121234567, 0412-1234567, 0412 1234567
const PATRON_TELEFONO_VENEZUELA = /^0(412|414|416|424|426)[-\s]?\d{7}$/;

/**
 * Paso 3: formulario con nombre y apellido, teléfono (para el
 * recordatorio por WhatsApp) y una nota opcional.
 */
@Component({
  selector: 'app-datos-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BarraProgresoComponent, BotonPrimarioComponent],
  templateUrl: './datos-cliente.component.html',
})
export class DatosClienteComponent {
  private readonly constructorFormularios = inject(FormBuilder);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  formulario = this.constructorFormularios.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(PATRON_TELEFONO_VENEZUELA)]],
    notaAdicional: [''],
  });

  continuar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.estado.cliente.set(this.formulario.getRawValue() as any);
    this.router.navigate(['/agendar/confirmacion']);
  }
}
