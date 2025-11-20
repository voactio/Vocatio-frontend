import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CarreraService } from './carrera.service';
import { environment } from '../../../environments/environment';
import { CarreraCardResponse, CarreraDetailResponse, TestimonioResponse } from '../models/carrera.model';

describe('CarreraService', () => {
  let service: CarreraService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarreraService]
    });
    service = TestBed.inject(CarreraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('buscar should return a list of careers (GET)', () => {
    const dummyCarreras: CarreraCardResponse[] = [
      { id: 1, nombre: 'Ingeniería', modalidad: 'Presencial', perfilRiasec: 'Investigador' },
      { id: 2, nombre: 'Diseño', modalidad: 'Virtual', perfilRiasec: 'Artístico' }
    ] as any; // Cast as any if properties are missing in mock

    service.buscar('Ingeniería', 'Presencial').subscribe(carreras => {
      expect(carreras.length).toBe(2);
      expect(carreras).toEqual(dummyCarreras);
    });

    const req = httpMock.expectOne(req => req.url.includes('/carreras') && req.params.has('nombre'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('nombre')).toBe('Ingeniería');
    req.flush(dummyCarreras);
  });

  it('getDetalle should return career details', () => {
    const dummyDetail: CarreraDetailResponse = { id: 1, nombre: 'Ingeniería', descripcion: 'Desc' } as any;

    service.getDetalle(1).subscribe(detail => {
      expect(detail).toEqual(dummyDetail);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/carreras/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDetail);
  });
});
