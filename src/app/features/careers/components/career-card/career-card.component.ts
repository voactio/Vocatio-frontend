import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarreraCardResponse } from '../../types/careerTypes';

@Component({
  selector: 'app-career-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/carreras', carrera?.id]" class="career-card">
      <div class="card-gradient"></div>
      <div class="card-content">
        <div class="card-header">
          <div class="icon-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h3>{{ carrera?.nombre }}</h3>
        </div>
        <p class="description">{{ carrera?.descripcionCorta }}</p>
        <div class="card-footer">
          <span class="view-more">Ver detalles →</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .career-card {
      position: relative;
      display: block;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 16px;
      padding: 1px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      text-decoration: none;
      height: 100%;
      min-height: 200px;
    }

    .career-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.4);
    }

    .career-card:hover .card-gradient {
      opacity: 0.8;
    }

    .card-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card-content {
      position: relative;
      background: white;
      border-radius: 15px;
      padding: 24px;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .icon-badge {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      line-height: 1.4;
      flex: 1;
    }

    .description {
      color: #4a5568;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: auto;
    }

    .view-more {
      color: #3b82f6;
      font-weight: 600;
      font-size: 0.9rem;
      transition: transform 0.3s ease;
      display: inline-block;
    }

    .career-card:hover .view-more {
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .card-content {
        padding: 20px;
      }

      h3 {
        font-size: 1.1rem;
      }

      .description {
        font-size: 0.9rem;
      }
    }
  `]
})
export class CareerCardComponent {
  @Input() carrera?: CarreraCardResponse;
}
