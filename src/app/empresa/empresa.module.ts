import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { GestionarUsuariosComponent } from './gestionar-usuarios/gestionar-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';
import { UsuariosViewComponent } from './usuarios-view/usuarios-view.component';


@NgModule({
  declarations: [
    GestionarUsuariosComponent,
    UsuariosCreateComponent,
    UsuariosEditComponent,
    UsuariosViewComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmpresaModule { }
