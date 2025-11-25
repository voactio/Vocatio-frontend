import { Routes } from '@angular/router';
import { CarrerasPage } from './carreras.page';
import { CarreraDetailPage } from './pages/carrera-detail.page';

export const CARRERAS_ROUTES: Routes = [
  {
    path: '',
    component: CarrerasPage
  },
  {
    path: ':id',
    component: CarreraDetailPage
  }
];
