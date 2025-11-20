import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarreraListComponent } from './carrera-list.component';
import { CarreraService } from '../../../core/services/carrera.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

describe('CarreraListComponent', () => {
  let component: CarreraListComponent;
  let fixture: ComponentFixture<CarreraListComponent>;
  let carreraServiceMock: any;

  beforeEach(async () => {
    carreraServiceMock = {
      buscar: jasmine.createSpy('buscar').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [CarreraListComponent, ReactiveFormsModule],
      providers: [
        { provide: CarreraService, useValue: carreraServiceMock },
        { provide: ActivatedRoute, useValue: {} } // Mock ActivatedRoute if needed by RouterLink
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarreraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load careers on init', () => {
    expect(carreraServiceMock.buscar).toHaveBeenCalled();
  });

  it('should filter careers', () => {
    component.filterForm.patchValue({ nombre: 'Ingeniería' });
    component.filtrar();
    expect(component.page).toBe(0);
    expect(carreraServiceMock.buscar).toHaveBeenCalledWith('Ingeniería', undefined, undefined, 0, 12);
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({ nombre: 'Ingeniería' });
    component.limpiarFiltros();
    expect(component.filterForm.value.nombre).toBeNull();
    expect(carreraServiceMock.buscar).toHaveBeenCalled();
  });
});
