import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatricesRoutingModule } from './matrices-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { ArticulosAplicablesComponent } from './articulos-aplicables/articulos-aplicables.component';
import { EditComponent } from './edit/edit.component';
import { MatrizArticulosViewComponent } from './matriz-articulos-view/matriz-articulos-view.component';
import { ShareModule } from '../share/share.module';
import { MatrizArticulosEditComponent } from './matriz-articulos-edit/matriz-articulos-edit.component';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    ViewComponent,
    ArticulosAplicablesComponent,
    EditComponent,
    MatrizArticulosViewComponent,
    MatrizArticulosEditComponent
  ],
  imports: [
    CommonModule,
    MatricesRoutingModule,
    ShareModule,
    FormsModule
  ]
})
export class MatricesModule { }
