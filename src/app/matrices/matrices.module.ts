import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatricesRoutingModule } from './matrices-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    MatricesRoutingModule
  ]
})
export class MatricesModule { }
