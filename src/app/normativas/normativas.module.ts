import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormativasRoutingModule } from './normativas-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    NormativasRoutingModule
  ]
})
export class NormativasModule { }
