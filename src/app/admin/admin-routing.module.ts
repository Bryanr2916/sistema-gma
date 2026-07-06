import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './riesgos-ambientales/index/index.component';
import { ViewComponent } from './riesgos-ambientales/view/view.component';
import { AdminPermisosIndexComponent } from './permisos/index/index.component';
import { AdminPermisosCreateComponent } from './permisos/create/create.component';
import { AdminPermisosViewComponent } from './permisos/view/view.component';
import { AdminPermisosEditComponent } from './permisos/edit/edit.component';
import { TipoGuard } from '../core/guards/tipo.guard';
import { TIPOS_USUARIO } from '../core/services/constantes';

const routes: Routes = [
  {
    path: 'matrices',
    loadChildren: () => import('./matrices/matrices.module').then(m => m.MatricesModule),
    canActivate: [TipoGuard],
    data: { tipos: [TIPOS_USUARIO.adminSistema]}
  },
  { path: "riesgos-ambientales", component: IndexComponent },
  { path: "riesgos-ambientales/view/:id", component: ViewComponent },
  { path: "permisos", component: AdminPermisosIndexComponent },
  { path: "permisos/crear", component: AdminPermisosCreateComponent },
  { path: "permisos/view/:id", component: AdminPermisosViewComponent },
  { path: "permisos/editar/:id", component: AdminPermisosEditComponent },
  { path: "", redirectTo: "riesgos-ambientales", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
