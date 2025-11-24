import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-career-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="filter-container">
      <div class="filter-group">
        <label>Buscar por nombre:</label>
        <input type="text" [(ngModel)]="filters.nombre" (ngModelChange)="onFilterChange()" placeholder="Ej. Ingeniería...">
      </div>
      
      <div class="filter-group">
        <label>Modalidad:</label>
        <select [(ngModel)]="filters.modalidad" (change)="onFilterChange()">
          <option value="">Todas</option>
          <option value="Presencial">Presencial</option>
          <option value="Remoto">Remoto</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Perfil RIASEC:</label>
        <select [(ngModel)]="filters.perfilRiasec" (change)="onFilterChange()">
          <option value="">Todos</option>
          <option value="Realista">Realista</option>
          <option value="Investigador">Investigador</option>
          <option value="Artístico">Artístico</option>
          <option value="Social">Social</option>
          <option value="Emprendedor">Emprendedor</option>
          <option value="Convencional">Convencional</option>
        </select>
      </div>
    </div>
  `,
    styles: [`
    .filter-container {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    input, select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
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
}
