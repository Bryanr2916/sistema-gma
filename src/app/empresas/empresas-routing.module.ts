import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'crear',component:CreateComponent},
  {path:'editar/:id',component:EditComponent},
  {path:'ver/:id',component:ViewComponent},
  {path:':id/usuarios',component:UsuariosIndexComponent},
  {path:':id/usuarios/crear',component:UsuariosCreateComponent},
  {path:':id/usuarios/:idUsuario/editar',component:UsuariosIndexComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
