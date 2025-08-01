import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { GestionarUsuariosComponent } from './gestionar-usuarios/gestionar-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';


@NgModule({
  declarations: [
    GestionarUsuariosComponent,
    UsuariosCreateComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmpresaModule { }
