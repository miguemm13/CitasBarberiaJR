import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-[100dvh] w-full flex items-center justify-center bg-fondo-pagina py-6 px-3">
      <div
        class="w-full max-w-[430px] max-h-[92dvh] overflow-y-auto bg-negro-mate text-crema relative rounded-3xl shadow-2xl shadow-black/60 border border-white/10"
      >
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {}
