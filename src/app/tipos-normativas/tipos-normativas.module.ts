import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposNormativasRoutingModule } from './tipos-normativas-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    TiposNormativasRoutingModule
  ]
})
export class TiposNormativasModule { }
