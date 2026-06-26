import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { IndexComponent } from './riesgos-ambientales/index/index.component';
import { ViewComponent } from './riesgos-ambientales/view/view.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
