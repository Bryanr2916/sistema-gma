import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { ReestablecerContrasenaComponent } from './reestablecer-contrasena/reestablecer-contrasena.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';


@NgModule({
  declarations: [
    PerfilComponent,
    InicioSesionComponent,
    ReestablecerContrasenaComponent,
    PerfilEditComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuarioModule { }
