import { Routes } from '@angular/router';
import { CarreraListComponent } from './features/carreras/carrera-list/carrera-list.component';
import { CarreraDetailComponent } from './features/carreras/carrera-detail/carrera-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'carreras', pathMatch: 'full' },
  { path: 'carreras', component: CarreraListComponent },
  { path: 'carreras/:id', component: CarreraDetailComponent },
  // Otras rutas...
];
