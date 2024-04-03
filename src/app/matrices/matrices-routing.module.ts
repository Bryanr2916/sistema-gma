import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { ArticulosAplicablesComponent } from './articulos-aplicables/articulos-aplicables.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'crear',component:CreateComponent},
  {path:'ver/:id',component:ViewComponent},
  {path:'crear-articulos/:id',component:ArticulosAplicablesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatricesRoutingModule { }
