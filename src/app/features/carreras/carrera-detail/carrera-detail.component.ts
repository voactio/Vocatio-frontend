import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraDetailResponse, TestimonioResponse } from '../../../core/models/carrera.model';

@Component({
  selector: 'app-carrera-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrera-detail.component.html',
  styleUrls: ['./carrera-detail.component.css']
})
export class CarreraDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private carreraService = inject(CarreraService);

  carrera: CarreraDetailResponse | null = null;
  testimonios: TestimonioResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDatos(+id);
    }
  }

  cargarDatos(id: number) {
    this.loading = true;
    // Cargar detalle
    this.carreraService.getDetalle(id).subscribe({
      next: (data) => {
        this.carrera = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información de la carrera.';
        this.loading = false;
        console.error(err);
      }
    });

    // Cargar testimonios (Funcionalidad 3)
    this.carreraService.getTestimonios(id).subscribe({
      next: (data) => {
        this.testimonios = data;
      },
      error: (err) => console.error('Error cargando testimonios', err)
    });
  }
}
