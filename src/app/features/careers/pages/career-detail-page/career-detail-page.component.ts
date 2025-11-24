import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CareerService } from '../../services/careerService';
import {
  CarreraDetailResponse,
  RecursoResponse,
  TestimonioResponse,
  UniversitiesByCareerResponse
} from '../../types/careerTypes';

@Component({
  selector: 'app-career-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detail-page" *ngIf="!loading(); else loadingTpl">
      <button class="back-btn" routerLink="/carreras">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver al catálogo
      </button>

      <div *ngIf="carrera()" class="hero-section">
        <div class="hero-gradient"></div>
        <div class="hero-content">
          <div class="hero-badge">Carrera Profesional</div>
          <h1 class="hero-title">{{ carrera()?.nombre }}</h1>
          <p class="hero-description">{{ carrera()?.descripcion }}</p>
          
          <div class="meta-cards">
            <div class="meta-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div class="meta-label">Duración</div>
                <div class="meta-value">{{ carrera()?.duracionAnios }} años</div>
              </div>
            </div>
            <div class="meta-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div>
                <div class="meta-label">Modalidad</div>
                <div class="meta-value">{{ carrera()?.modalidad }}</div>
              </div>
            </div>
            <div class="meta-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <div>
                <div class="meta-label">Salario Promedio</div>
                <div class="meta-value">{{ carrera()?.rangoSalarioPromedio }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <div class="tabs">
          <button 
            [class.active]="activeTab() === 'plan'" 
            (click)="activeTab.set('plan')"
            class="tab-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Plan de Estudios
          </button>
          <button 
            [class.active]="activeTab() === 'universidades'" 
            (click)="activeTab.set('universidades')"
            class="tab-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Dónde estudiar
          </button>
          <button 
            [class.active]="activeTab() === 'testimonios'" 
            (click)="activeTab.set('testimonios')"
            class="tab-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Testimonios
          </button>
        </div>

        <div class="tab-content">
          <!-- Plan de Estudios -->
          <div *ngIf="activeTab() === 'plan'" class="tab-panel">
            <div *ngIf="recursos().length > 0; else noData" class="resources-grid">
              <div *ngFor="let recurso of recursos()" class="resource-card">
                <div class="resource-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <div class="resource-info">
                  <h4>{{ recurso.nombre }}</h4>
                  <span class="resource-type">{{ recurso.tipo }}</span>
                </div>
                <a [href]="recurso.url" target="_blank" class="resource-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Universidades -->
          <div *ngIf="activeTab() === 'universidades'" class="tab-panel">
            <div *ngIf="universidades().length > 0; else noData" class="uni-grid">
              <div *ngFor="let uni of universidades()" class="uni-card">
                <div class="uni-logo">
                  <img [src]="uni.logo || 'assets/placeholder-uni.png'" [alt]="uni.nombre">
                </div>
                <h3>{{ uni.nombre }}</h3>
                <a [href]="uni.url" target="_blank" class="uni-link">
                  Visitar sitio web
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Testimonios -->
          <div *ngIf="activeTab() === 'testimonios'" class="tab-panel">
            <div *ngIf="testimonios().length > 0; else noData" class="testimonials-grid">
              <div *ngFor="let test of testimonios()" class="testimonial-card">
                <div class="quote-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                </div>
                <p class="testimonial-text">"{{ test.texto }}"</p>
                <div class="testimonial-author">
                  <div class="author-avatar">
                    {{ test.nombreUsuario.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ test.nombreUsuario }}</span>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noData>
            <div class="no-data">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p>No hay información disponible</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Cargando información de la carrera...</p>
      </div>
    </ng-template>

    <div *ngIf="error()" class="error-overlay">
      <div class="error-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error() }}</p>
        <button routerLink="/carreras" class="back-to-list">Volver al catálogo</button>
      </div>
    </div>
  `,
  styles: [`
    .detail-page {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: white;
      border: 2px solid #e2e8f0;
      color: #4a5568;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 20px;
    }

    .back-btn:hover {
      border-color: #3b82f6;
      color: #667eea;
      transform: translateX(-4px);
    }

    .hero-section {
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 80px 40px;
      overflow: hidden;
    }

    .hero-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      color: white;
    }

    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 20px 0;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0 0 40px 0;
      opacity: 0.95;
      max-width: 800px;
    }

    .meta-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      max-width: 800px;
    }

    .meta-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .meta-card:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-4px);
    }

    .meta-card svg {
      flex-shrink: 0;
    }

    .meta-label {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .content-section {
      max-width: 1200px;
      margin: -40px auto 0;
      padding: 0 40px 60px;
      position: relative;
    }

    .tabs {
      display: flex;
      gap: 12px;
      background: white;
      padding: 8px;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      margin-bottom: 32px;
    }

    .tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: transparent;
      border: none;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      color: #718096;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      background: #f7fafc;
      color: #4a5568;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .tab-content {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }

    .tab-panel {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .resources-grid {
      display: grid;
      gap: 16px;
    }

    .resource-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .resource-card:hover {
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .resource-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .resource-info {
      flex: 1;
    }

    .resource-info h4 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-size: 1.1rem;
    }

    .resource-type {
      color: #718096;
      font-size: 0.9rem;
    }

    .resource-link {
      color: #667eea;
      transition: transform 0.3s ease;
    }

    .resource-link:hover {
      transform: scale(1.2);
    }

    .uni-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .uni-card {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .uni-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .uni-logo {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .uni-logo img {
      max-width: 80px;
      max-height: 80px;
    }

    .uni-card h3 {
      margin: 0 0 16px 0;
      color: #2d3748;
      font-size: 1.2rem;
    }

    .uni-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      transition: gap 0.3s ease;
    }

    .uni-link:hover {
      gap: 10px;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 16px;
      padding: 28px;
      position: relative;
    }

    .quote-icon {
      color: #667eea;
      opacity: 0.2;
      margin-bottom: 12px;
    }

    .testimonial-text {
      font-size: 1rem;
      line-height: 1.6;
      color: #4a5568;
      margin: 0 0 20px 0;
      font-style: italic;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .testimonial-author span {
      font-weight: 600;
      color: #2d3748;
    }

    .no-data {
      text-align: center;
      padding: 80px 20px;
      color: #a0aec0;
    }

    .no-data svg {
      margin-bottom: 20px;
    }

    .no-data p {
      font-size: 1.1rem;
      margin: 0;
    }

    .loading-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #718096;
      font-size: 1.1rem;
    }

    .error-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .error-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .error-card svg {
      color: #fc8181;
      margin-bottom: 20px;
    }

    .error-card p {
      color: #e53e3e;
      font-size: 1.1rem;
      margin: 0 0 24px 0;
    }

    .back-to-list {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-to-list:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 60px 20px;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-description {
        font-size: 1rem;
      }

      .meta-cards {
        grid-template-columns: 1fr;
      }

      .content-section {
        padding: 0 20px 40px;
      }

      .tabs {
        flex-direction: column;
      }

      .tab-content {
        padding: 24px;
      }

      .uni-grid,
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CareerDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private careerService = inject(CareerService);

  carrera = signal<CarreraDetailResponse | null>(null);
  recursos = signal<RecursoResponse[]>([]);
  testimonios = signal<TestimonioResponse[]>([]);
  universidades = signal<UniversitiesByCareerResponse[]>([]);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<string>('plan');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id);
    } else {
      this.error.set('ID de carrera no válido');
      this.loading.set(false);
    }
  }

  async loadData(id: number) {
    try {
      this.loading.set(true);

      const [detalle, recursos, testimonios, universidades] = await Promise.all([
        this.careerService.getDetalle(id),
        this.careerService.getRecursos(id),
        this.careerService.getTestimonios(id),
        this.careerService.getUniversities(id)
      ]);

      this.carrera.set(detalle);
      this.recursos.set(recursos);
      this.testimonios.set(testimonios);
      this.universidades.set(universidades);

    } catch (err) {
      console.error(err);
      this.error.set('Error al cargar la información de la carrera');
    } finally {
      this.loading.set(false);
    }
  }
}
