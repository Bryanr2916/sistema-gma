import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { ReestablecerContrasenaComponent } from './reestablecer-contrasena/reestablecer-contrasena.component';


@NgModule({
  declarations: [
    PerfilComponent,
    InicioSesionComponent,
    ReestablecerContrasenaComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
