import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <h2>Mi Perfil</h2>

    <form [formGroup]="perfilForm" (ngSubmit)="onSubmit()">

      <label>Nombre</label>
      <input type="text" formControlName="nombre">

      <label>Nivel Educativo</label>
      <input type="text" formControlName="nivelEducativo">

      <label>Contraseña (opcional)</label>
      <input type="password" formControlName="contrasena">

      <label>Carrera ID</label>
      <input type="number" formControlName="carreraId">

      <label>URL Imagen Perfil</label>
      <input type="text" formControlName="urlImagenPerfil">

      <button type="submit" [disabled]="perfilForm.invalid">Guardar Cambios</button>
    </form>

    <div *ngIf="mensaje" style="color: green;">{{ mensaje }}</div>
    <div *ngIf="error" style="color: red;">{{ error }}</div>
  `,
  styleUrl: './perfil.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  mensaje = '';
  error = '';
  usuarioId!: string;

  perfilForm = this.fb.group({
    nombre: ['', Validators.required],
    nivelEducativo: ['', Validators.required],
    contrasena: [''],
    carreraId: [null],
    urlImagenPerfil: ['']
  });

  ngOnInit() {

    const user = this.authService.currentUser();

    if (!user || !user.id) {
      this.error = "No se pudo cargar el perfil: usuario no autenticado.";
      return;
    }

    this.perfilForm.patchValue({
      nombre: user.nombre,
      nivelEducativo: user.nivelEducativo,
      urlImagenPerfil: user.urlImagenPerfil
    })
  }

  onSubmit() {
    if (this.perfilForm.invalid) return;

    const req = {
      nombre: this.perfilForm.value.nombre!,
      nivelEducativo: this.perfilForm.value.nivelEducativo!,
      contrasena: this.perfilForm.value.contrasena || ' ',
      carreraId: this.perfilForm.value.carreraId || undefined,
      urlImagenPerfil: this.perfilForm.value.urlImagenPerfil || undefined
    };

    this.usuarioService.updateUsuario(this.usuarioId, req).subscribe({
      next: resp => {
        this.mensaje = "Perfil actualizado correctamente";
        this.error = "";
      },
      error: err => {
        this.error = err.error?.mensaje || "Error al actualizar perfil";
        this.mensaje = "";
      }
    });
  }
}
