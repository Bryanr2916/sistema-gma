import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';


@NgModule({
  declarations: [
    PerfilComponent,
    InicioSesionComponent,
    CambiarContrasenaComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule
  ]
})
export class UsuarioModule { }
