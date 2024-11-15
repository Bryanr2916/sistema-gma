import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ViewComponent } from './view/view.component';
import { TipoGuard } from '../core/guards/tipo.guard';

const routes: Routes = [
  {path:'',component:IndexComponent, canActivate: [TipoGuard], data: {"tipo": 1}},
  {path: 'ver', component:ViewComponent, canActivate: [TipoGuard], data: {"tipo": 2}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
