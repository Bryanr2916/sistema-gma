import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiesgosAmbientalesRoutingModule } from './riesgos-ambientales-routing.module';
import { ViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
    RiesgosAmbientalesRoutingModule,
    FormsModule
  ]
})
export class RiesgosAmbientalesModule { }
