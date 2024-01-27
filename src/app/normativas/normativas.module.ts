import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormativasRoutingModule } from './normativas-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    NormativasRoutingModule
  ]
})
export class NormativasModule { }
