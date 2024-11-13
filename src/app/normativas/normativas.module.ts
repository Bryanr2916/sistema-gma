import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NormativasRoutingModule } from './normativas-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { ShareModule } from '../share/share.module';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    NormativasRoutingModule,
    FormsModule,
    ShareModule
  ]
})
export class NormativasModule { }
