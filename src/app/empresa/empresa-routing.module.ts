import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarUsuariosComponent } from './gestionar-usuarios/gestionar-usuarios.component';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';
import { UsuariosViewComponent } from './usuarios-view/usuarios-view.component';

const routes: Routes = [
  {path: "gestionar-usuarios", component: GestionarUsuariosComponent},
  {path: "gestionar-usuarios/crear", component: UsuariosCreateComponent},
  {path: "gestionar-usuarios/editar/:id", component: UsuariosEditComponent},
  { path: "gestionar-usuarios/ver/:id", component: UsuariosViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
