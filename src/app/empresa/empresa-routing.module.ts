import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionarUsuariosComponent } from './gestionar-usuarios/gestionar-usuarios.component';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';

const routes: Routes = [
  {path: "gestionar-usuarios", component: GestionarUsuariosComponent},
  {path: "gestionar-usuarios/crear", component: UsuariosCreateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
