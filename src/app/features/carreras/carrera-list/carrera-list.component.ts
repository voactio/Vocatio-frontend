import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraCardResponse } from '../../../core/models/carrera.model';

@Component({
  selector: 'app-carrera-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './carrera-list.component.html',
  styleUrls: ['./carrera-list.component.css']
})
export class CarreraListComponent implements OnInit {
  private carreraService = inject(CarreraService);
  private fb = inject(FormBuilder);

  carreras: CarreraCardResponse[] = [];
  page = 0;
  size = 12;
  
  filterForm = this.fb.group({
    nombre: [''],
    modalidad: [''],
    perfilRiasec: ['']
  });

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras() {
    const filters = this.filterForm.value;
    this.carreraService.buscar(
      filters.nombre || undefined,
      filters.modalidad || undefined,
      filters.perfilRiasec || undefined,
      this.page,
      this.size
    ).subscribe({
      next: (data) => {
        this.carreras = data;
      },
      error: (err) => console.error('Error al cargar carreras', err)
    });
  }

  filtrar() {
    this.page = 0; // Reset page on filter
    this.cargarCarreras();
  }

  limpiarFiltros() {
    this.filterForm.reset();
    this.filtrar();
  }

  siguientePagina() {
    this.page++;
    this.cargarCarreras();
  }

  anteriorPagina() {
    if (this.page > 0) {
      this.page--;
      this.cargarCarreras();
    }
  }
}
