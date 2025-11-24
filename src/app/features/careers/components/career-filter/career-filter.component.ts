import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-career-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <div class="filter-header">
        <h2>Filtrar Carreras</h2>
        <button *ngIf="hasActiveFilters()" class="clear-btn" (click)="clearFilters()">
          Limpiar filtros
        </button>
      </div>
      
      <div class="filter-grid">
        <div class="filter-group">
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar por nombre
          </label>
          <input 
            type="text" 
            [(ngModel)]="filters.nombre" 
            (ngModelChange)="onFilterChange()" 
            placeholder="Ej. Ingeniería, Diseño..."
            class="search-input">
        </div>
        
        <div class="filter-group">
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Modalidad
          </label>
          <select [(ngModel)]="filters.modalidad" (change)="onFilterChange()" class="select-input">
            <option value="">Todas las modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div class="filter-group">
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Perfil RIASEC
          </label>
          <select [(ngModel)]="filters.perfilRiasec" (change)="onFilterChange()" class="select-input">
            <option value="">Todos los perfiles</option>
            <option value="Realista">Realista</option>
            <option value="Investigador">Investigador</option>
            <option value="Artístico">Artístico</option>
            <option value="Social">Social</option>
            <option value="Emprendedor">Emprendedor</option>
            <option value="Convencional">Convencional</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 32px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .filter-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .clear-btn {
      background: white;
      border: 2px solid #3b82f6;
      color: #3b82f6;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .clear-btn:hover {
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 600;
      color: #4a5568;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    label svg {
      color: #3b82f6;
    }

    .search-input,
    .select-input {
      padding: 12px 16px;
      border: 2px solid transparent;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .search-input:focus,
    .select-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
      transform: translateY(-2px);
    }

    .search-input::placeholder {
      color: #a0aec0;
    }

    .select-input {
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .filter-container {
        padding: 20px;
      }

      .filter-grid {
        grid-template-columns: 1fr;
      }

      .filter-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class CareerFilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  filters = {
    nombre: '',
    modalidad: '',
    perfilRiasec: ''
  };

  onFilterChange() {
    this.filterChange.emit(this.filters);
  }

  hasActiveFilters(): boolean {
    return this.filters.nombre !== '' ||
      this.filters.modalidad !== '' ||
      this.filters.perfilRiasec !== '';
  }

  clearFilters() {
    this.filters = {
      nombre: '',
      modalidad: '',
      perfilRiasec: ''
    };
    this.onFilterChange();
  }
}
