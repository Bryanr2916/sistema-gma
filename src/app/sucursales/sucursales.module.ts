import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalesRoutingModule } from './sucursales-routing.module';
import { IndexComponent } from './index/index.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    SucursalesRoutingModule,
    FormsModule
  ]
})
export class SucursalesModule { }
