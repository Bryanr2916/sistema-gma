import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaLegalRoutingModule } from './area-legal-routing.module';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    AreaLegalRoutingModule
  ]
})
export class AreaLegalModule { }
