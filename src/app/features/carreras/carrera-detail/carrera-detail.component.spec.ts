import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarreraDetailComponent } from './carrera-detail.component';
import { CarreraService } from '../../../core/services/carrera.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CarreraDetailComponent', () => {
  let component: CarreraDetailComponent;
  let fixture: ComponentFixture<CarreraDetailComponent>;
  let carreraServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    carreraServiceMock = {
      getDetalle: jasmine.createSpy('getDetalle').and.returnValue(of({ id: 1, nombre: 'Ingeniería' })),
      getTestimonios: jasmine.createSpy('getTestimonios').and.returnValue(of([]))
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [CarreraDetailComponent],
      providers: [
        { provide: CarreraService, useValue: carreraServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarreraDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load career details and testimonials on init', () => {
    expect(carreraServiceMock.getDetalle).toHaveBeenCalledWith(1);
    expect(carreraServiceMock.getTestimonios).toHaveBeenCalledWith(1);
    expect(component.carrera).toEqual({ id: 1, nombre: 'Ingeniería' } as any);
  });
});
