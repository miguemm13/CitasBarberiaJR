import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendamientoEstadoService } from '../../../../nucleo/servicios/agendamiento-estado.service';
import { BarraProgresoComponent } from '../../../../compartido/componentes/barra-progreso/barra-progreso.component';
import { BotonPrimarioComponent } from '../../../../compartido/componentes/boton-primario/boton-primario.component';

/**
 * Paso 3: formulario simple con nombre y apellido, y una nota opcional.
 */
@Component({
  selector: 'app-datos-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, BarraProgresoComponent, BotonPrimarioComponent],
  templateUrl: './datos-cliente.component.html',
})
export class DatosClienteComponent {
  private readonly constructorFormularios = inject(FormBuilder);
  readonly estado = inject(AgendamientoEstadoService);
  private readonly router = inject(Router);

  formulario = this.constructorFormularios.group({
    nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
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
