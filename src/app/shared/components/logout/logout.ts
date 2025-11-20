import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  onLogout() {
    this.authService.logout();
    console.log('Sesión cerrada');
    this.router.navigate(['/auth/login'])
  }
}
