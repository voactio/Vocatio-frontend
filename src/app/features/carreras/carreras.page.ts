import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarreraService } from '../../core/services/carrera.service';
import { CarreraCard } from '../../core/models/carrera.model';

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carreras.page.html',
  styleUrls: ['./carreras.page.css']
})
export class CarrerasPage implements OnInit {
  private carreraService = inject(CarreraService);
  private router = inject(Router);

  carreras = this.carreraService.carreras;
  loading = this.carreraService.loading;

  // Filtros
  searchTerm: string = '';
  selectedModalidad: string = '';
  selectedPerfil: string = '';

  // Opciones para filtros
  modalidades = ['Presencial', 'Virtual', 'Híbrida'];
  perfilesRiasec = ['Realista', 'Investigador', 'Artístico', 'Social', 'Emprendedor', 'Convencional'];

  ngOnInit(): void {
    this.loadCarreras();
  }

  loadCarreras(): void {
    this.carreraService.getListadoInicial(0, 100).subscribe({
      next: () => console.log('Carreras cargadas'),
      error: (err) => console.error('Error al cargar carreras:', err)
    });
  }

  onSearch(): void {
    this.carreraService.buscarCarreras({
      nombre: this.searchTerm || undefined,
      modalidad: this.selectedModalidad || undefined,
      perfilRiasec: this.selectedPerfil || undefined,
      page: 0,
      size: 100
    }).subscribe({
      next: () => console.log('Búsqueda completada'),
      error: (err) => console.error('Error en búsqueda:', err)
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedModalidad = '';
    this.selectedPerfil = '';
    this.loadCarreras();
  }

  onCarreraClick(carreraId: number): void {
    this.router.navigate(['/carreras', carreraId]);
  }
}
