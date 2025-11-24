import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CareerService } from '../../services/careerService';
import { CareerCardComponent } from '../../components/career-card/career-card.component';
import { CareerFilterComponent } from '../../components/career-filter/career-filter.component';
import { CarreraCardResponse } from '../../types/careerTypes';

@Component({
  selector: 'app-career-list-container',
  standalone: true,
  imports: [CommonModule, CareerCardComponent, CareerFilterComponent],
  template: `
    <div class="container">
      <div class="header-section">
        <h1 class="main-title">
          <span class="gradient-text">Catálogo de Carreras</span>
        </h1>
        <p class="subtitle">Explora y descubre tu carrera ideal</p>
      </div>
      
      <app-career-filter (filterChange)="onFilterChange($event)"></app-career-filter>

      <div *ngIf="loading()" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando carreras...</p>
      </div>

      <div *ngIf="error()" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error() }}</p>
        <button (click)="loadCareers()" class="retry-btn">Reintentar</button>
      </div>

      <div *ngIf="!loading() && !error()">
        <div class="results-header" *ngIf="carreras().length > 0">
          <p class="results-count">
            <strong>{{ carreras().length }}</strong> carreras encontradas
          </p>
        </div>

        <div class="career-grid" *ngIf="carreras().length > 0">
          <app-career-card 
            *ngFor="let carrera of carreras(); trackBy: trackByCarreraId" 
            [carrera]="carrera"
            class="grid-item">
          </app-career-card>
        </div>

        <div *ngIf="carreras().length === 0" class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <h3>No se encontraron carreras</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>

        <div class="pagination" *ngIf="carreras().length > 0">
          <button (click)="prevPage()" [disabled]="page() === 0" class="pagination-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Anterior
          </button>
          <span class="page-indicator">Página {{ page() + 1 }}</span>
          <button (click)="nextPage()" class="pagination-btn">
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
      min-height: 100vh;
    }

    .header-section {
      text-align: center;
      margin-bottom: 48px;
    }

    .main-title {
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 16px 0;
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #718096;
      margin: 0;
    }

    .results-header {
      margin-bottom: 24px;
    }

    .results-count {
      color: #4a5568;
      font-size: 1rem;
      margin: 0;
    }

    .results-count strong {
      color: #3b82f6;
      font-size: 1.1rem;
    }

    .career-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 28px;
      margin-bottom: 48px;
    }

    .grid-item {
      animation: fadeInUp 0.5s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .loading-container {
      text-align: center;
      padding: 80px 20px;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #718096;
      font-size: 1.1rem;

    .error-container p {
      font-size: 1.1rem;
      margin: 0 0 24px 0;
    }

    .retry-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    .no-results {
      text-align: center;
      padding: 80px 20px;
      color: #718096;
    }

    .no-results svg {
      margin-bottom: 24px;
      opacity: 0.5;
    }

    .no-results h3 {
      font-size: 1.5rem;
      color: #2d3748;
      margin: 0 0 12px 0;
    }

    .no-results p {
      font-size: 1.1rem;
      margin: 0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      margin-top: 48px;
    }

    .pagination-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 2px solid #e2e8f0;
      color: #4a5568;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .pagination-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

      }

      .main-title {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
      }

      .career-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .pagination {
        flex-direction: column;
        gap: 12px;
      }

      .pagination-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CareerListContainerComponent implements OnInit {
  private careerService = inject(CareerService);

  carreras = signal<CarreraCardResponse[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  page = signal<number>(0);
  size = signal<number>(10);

  currentFilters: any = {};

  ngOnInit() {
    this.loadCareers();
  }

  async loadCareers() {
    this.loading.set(true);
    this.error.set(null);
    try {
      let data: CarreraCardResponse[];

      const hasFilters = Object.values(this.currentFilters).some(val => val !== '');

      if (hasFilters) {
        data = await this.careerService.filtrarCarreras({
          ...this.currentFilters,
          page: this.page(),
          size: this.size()
        });
      } else {
        data = await this.careerService.getListado(this.page(), this.size());
      }

      this.carreras.set(data);
    } catch (err) {
      this.error.set('Ocurrió un error al cargar las carreras. Por favor intente nuevamente.');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  onFilterChange(filters: any) {
    this.currentFilters = filters;
    this.page.set(0);
    this.loadCareers();
  }

  prevPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.loadCareers();
    }
  }

  nextPage() {
    this.page.update(p => p + 1);
    this.loadCareers();
  }

  trackByCarreraId(index: number, carrera: CarreraCardResponse): number {
    return carrera.id;
  }
}
