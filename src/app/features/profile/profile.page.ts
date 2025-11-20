import { Component } from '@angular/core';
import { PerfilComponent } from '../../shared/components/perfil/perfil';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [PerfilComponent],
  template: `<app-perfil></app-perfil>`
})
export class ProfilePage {}
