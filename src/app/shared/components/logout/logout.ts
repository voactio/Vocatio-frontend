import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  template: `
    <div class="logout-container">
      <button (click)="onLogout()">
        Cerrar sesión
      </button>
    </div>
  `,
  styleUrl: './logout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent {
  private authService = inject(AuthService);

  onLogout() {
    this.authService.logout();
    console.log('Sesión cerrada');
    // Aqui se debe agregar navegación, por ejemplo:
    // this.router.navigate(['/auth/login']);
  }
}
