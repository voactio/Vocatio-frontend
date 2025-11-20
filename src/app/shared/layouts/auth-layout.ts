import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="auth-container">
      <nav>BAR/LINKS</nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class authLayoutComponent {}
