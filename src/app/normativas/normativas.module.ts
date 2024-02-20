import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormativasRoutingModule } from './normativas-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    NormativasRoutingModule,
    FormsModule
  ]
})
export class NormativasModule { }
