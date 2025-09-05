import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { ArticulosAplicablesComponent } from './articulos-aplicables/articulos-aplicables.component';
import { EditComponent } from './edit/edit.component';
import { MatrizArticulosEditComponent } from './matriz-articulos-edit/matriz-articulos-edit.component';
import { TipoGuard } from '../core/guards/tipo.guard';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'crear',component:CreateComponent},
  {path:'editar/:id',component:EditComponent},
  {path:'ver/:id',component:ViewComponent},
  {path:'crear-articulos/:id',component:ArticulosAplicablesComponent},
  {path:'editar-articulo/:id',component:MatrizArticulosEditComponent,
    canActivate: [TipoGuard],
    data: {tipos: [1,2,3]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatricesRoutingModule { }
