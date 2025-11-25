import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarreraService } from '../../../core/services/carrera.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { RecursoService } from '../../../core/services/recurso.service';
import { TestimonioService } from '../../../core/services/testimonio.service';
import { CarreraDetail } from '../../../core/models/carrera.model';

@Component({
  selector: 'app-carrera-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrera-detail.page.html',
  styleUrls: ['./carrera-detail.page.css']
})
export class CarreraDetailPage implements OnInit {
  private carreraService = inject(CarreraService);
  private universidadService = inject(UniversidadService);
  private recursoService = inject(RecursoService);
  private testimonioService = inject(TestimonioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  carreraDetail = this.carreraService.carreraDetail;
  loading = this.carreraService.loading;

  universidades = this.universidadService.universidades;
  loadingUniversidades = this.universidadService.loading;

  recursos = this.recursoService.recursos;
  loadingRecursos = this.recursoService.loading;

  testimonios = this.testimonioService.testimonios;
  loadingTestimonios = this.testimonioService.loading;

  // Testimonio inline
  nuevoTestimonio = '';
  enviandoTestimonio = signal<boolean>(false);

  // Tab activa
  activeTab: 'resumen' | 'universidades' | 'recursos' | 'testimonios' = 'resumen';

  private carreraId: number = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carreraId = +id;
      // Resetear todos los servicios al cambiar de carrera
      this.universidadService.reset();
      this.recursoService.reset();
      this.testimonioService.reset();
      this.loadCarreraDetail(this.carreraId);
    }
  }

  loadCarreraDetail(id: number): void {
    this.carreraService.getCarreraDetail(id).subscribe({
      next: () => console.log('Detalle de carrera cargado'),
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        this.router.navigate(['/carreras']);
      }
    });
  }

  setActiveTab(tab: 'resumen' | 'universidades' | 'recursos' | 'testimonios'): void {
    this.activeTab = tab;

    // Cargar universidades cuando se activa el tab
    if (tab === 'universidades' && this.carreraId) {
      this.loadUniversidades();
    }

    // Cargar recursos cuando se activa el tab
    if (tab === 'recursos' && this.carreraId) {
      this.loadRecursos();
    }

    // Cargar testimonios cuando se activa el tab
    if (tab === 'testimonios' && this.carreraId) {
      this.loadTestimonios();
    }
  }

  loadUniversidades(): void {
    this.universidadService.getUniversidadesPorCarrera(this.carreraId).subscribe({
      next: () => console.log('Universidades cargadas'),
      error: (err) => console.error('Error al cargar universidades:', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/carreras']);
  }

  abrirInfoUniversidad(universidad: any): void {
    // Priorizar URL del plan específico, sino URL general de la universidad
    const url = universidad.urlPlanEspecifico || universidad.urlUniversidad;
    if (url) {
      window.open(url, '_blank');
    }
  }

  loadRecursos(): void {
    console.log('Cargando recursos para carrera ID:', this.carreraId);
    this.recursoService.getRecursosPorCarrera(this.carreraId).subscribe({
      next: (recursos) => {
        console.log('Recursos cargados:', recursos);
        console.log('Cantidad de recursos:', recursos?.length);
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
      }
    });
  }

  abrirRecurso(recurso: any): void {
    if (recurso.url) {
      window.open(recurso.url, '_blank');
    }
  }

  getRecursoIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'INFOGRAFIA': '📊',
      'VIDEO': '🎥',
      'CURSO': '📚',
      'DOCUMENTO': '📄'
    };
    return iconos[tipo] || '📄';
  }

  getRecursoClass(tipo: string): string {
    const clases: { [key: string]: string } = {
      'INFOGRAFIA': 'recurso-infografia',
      'VIDEO': 'recurso-video',
      'CURSO': 'recurso-curso',
      'DOCUMENTO': 'recurso-documento'
    };
    return clases[tipo] || 'recurso-documento';
  }

  // Filtrar recursos por tipo
  getRecursosPorTipo(tipo: string) {
    return this.recursos()?.filter(r => r.tipoRecurso === tipo) || [];
  }

  // Verificar si hay recursos de un tipo específico
  tieneRecursosTipo(tipo: string): boolean {
    return this.getRecursosPorTipo(tipo).length > 0;
  }

  loadTestimonios(): void {
    console.log('Cargando testimonios para carrera ID:', this.carreraId);
    this.testimonioService.getTestimoniosPorCarrera(this.carreraId).subscribe({
      next: (testimonios) => {
        console.log('Testimonios cargados:', testimonios);
        console.log('Cantidad de testimonios:', testimonios?.length);
      },
      error: (err) => {
        console.error('Error al cargar testimonios:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
      }
    });
  }

  getInicialesTestimonio(nombre?: string): string {
    if (!nombre) return '??';
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) {
      return palabras[0].substring(0, 1).toUpperCase();
    }
    return (palabras[0][0] + (palabras[palabras.length - 1]?.[0] || '')).toUpperCase();
  }

  enviarTestimonio(): void {
    if (!this.nuevoTestimonio.trim()) {
      alert('Por favor, escribe tu testimonio');
      return;
    }

    this.enviandoTestimonio.set(true);

    const request = {
      textoTestimonio: this.nuevoTestimonio.trim()
    };

    this.testimonioService.crearTestimonio(this.carreraId, request).subscribe({
      next: (response) => {
        console.log('Testimonio creado exitosamente:', response);
        alert('¡Gracias por compartir tu testimonio! Será revisado antes de publicarse.');
        this.nuevoTestimonio = '';
        this.enviandoTestimonio.set(false);
      },
      error: (err) => {
        console.error('Error al crear testimonio:', err);
        alert('Hubo un error al enviar tu testimonio. Inténtalo nuevamente.');
        this.enviandoTestimonio.set(false);
      }
    });
  }
}
