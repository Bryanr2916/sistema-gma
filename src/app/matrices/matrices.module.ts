import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatricesRoutingModule } from './matrices-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { ArticulosAplicablesComponent } from './articulos-aplicables/articulos-aplicables.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    ViewComponent,
    ArticulosAplicablesComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    MatricesRoutingModule,
    FormsModule
  ]
})
export class MatricesModule { }
