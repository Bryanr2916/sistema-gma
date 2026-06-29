import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { IndexComponent } from './riesgos-ambientales/index/index.component';
import { ViewComponent } from './riesgos-ambientales/view/view.component';
import { AdminPermisosIndexComponent } from './permisos/index/index.component';
import { AdminPermisosCreateComponent } from './permisos/create/create.component';
import { AdminPermisosViewComponent } from './permisos/view/view.component';
import { AdminPermisosEditComponent } from './permisos/edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent,
    ViewComponent,
    AdminPermisosIndexComponent,
    AdminPermisosCreateComponent,
    AdminPermisosViewComponent,
    AdminPermisosEditComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
