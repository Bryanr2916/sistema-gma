import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './riesgos-ambientales/index/index.component';
import { ViewComponent } from './riesgos-ambientales/view/view.component';

const routes: Routes = [
  { path: "", component: IndexComponent },
  { path: "view/:id", component: ViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
