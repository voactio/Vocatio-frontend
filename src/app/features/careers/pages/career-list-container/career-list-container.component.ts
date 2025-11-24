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
      <h1>Catálogo de Carreras</h1>
      
      <app-career-filter (filterChange)="onFilterChange($event)"></app-career-filter>

      <div *ngIf="loading()" class="loading-spinner">
        Cargando carreras...
      </div>

      <div *ngIf="error()" class="error-message">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error()" class="career-grid">
        <app-career-card 
          *ngFor="let carrera of carreras()" 
          [carrera]="carrera">
        </app-career-card>
      </div>

      <div *ngIf="!loading() && !error() && carreras().length === 0" class="no-results">
        No se encontraron carreras con los filtros seleccionados.
      </div>

      <div class="pagination" *ngIf="!loading() && !error() && carreras().length > 0">
        <button (click)="prevPage()" [disabled]="page() === 0">Anterior</button>
        <span>Página {{ page() + 1 }}</span>
        <button (click)="nextPage()">Siguiente</button>
      </div>
    </div>
  `,
    styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .career-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .loading-spinner, .error-message, .no-results {
      text-align: center;
      padding: 40px;
      font-size: 1.2em;
    }
    .error-message {
      color: red;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 40px;
    }
    button {
      padding: 8px 16px;
      cursor: pointer;
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
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

            // Check if we have active filters
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
        this.page.set(0); // Reset to first page on filter change
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
}
