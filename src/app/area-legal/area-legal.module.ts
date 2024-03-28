import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaLegalRoutingModule } from './area-legal-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
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
    FormsModule
  ]
})
export class AreaLegalModule { }
