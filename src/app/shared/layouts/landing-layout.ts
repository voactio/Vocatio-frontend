import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="landing-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class landingLayoutComponent {}
