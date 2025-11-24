import { Routes } from '@angular/router';
import { OlvidoPageComponent } from './pages/olvido.page';
import { ReContraPageComponent } from './pages/recontrasena.page';


export const RECUPERACION_ROUTES: Routes = [
  { path: 'olvido', component:  OlvidoPageComponent},
  { path: 'recontra', component: ReContraPageComponent }
];
