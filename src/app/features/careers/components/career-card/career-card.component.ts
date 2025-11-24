import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarreraCardResponse } from '../../types/careerTypes';

@Component({
    selector: 'app-career-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="career-card">
      <h3>{{ carrera?.nombre }}</h3>
      <p>{{ carrera?.descripcionCorta }}</p>
    </div>
  `,
    styles: [`
    .career-card {
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: white;
    }
    h3 {
      margin-top: 0;
      color: #333;
    }
    p {
      color: #666;
    }
  `]
})
export class CareerCardComponent {
    @Input() carrera?: CarreraCardResponse;
}
