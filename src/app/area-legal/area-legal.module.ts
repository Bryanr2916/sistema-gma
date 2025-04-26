import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaLegalRoutingModule } from './area-legal-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AreaLegalRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AreaLegalModule { }
