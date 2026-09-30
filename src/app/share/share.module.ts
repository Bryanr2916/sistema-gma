import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';
import { TruncarTextoPipe } from './pipes/truncar-texto.pipe';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { DropdownSearchComponent } from './dropdown-search/dropdown-search.component';
import { LogoEmpresaComponent } from './logo-empresa/logo-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PaginaNoEncontradaComponent,
    TruncarTextoPipe,
    MultiSelectComponent,
    DropdownSearchComponent,
    LogoEmpresaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TruncarTextoPipe,
    MultiSelectComponent,
    DropdownSearchComponent,
    LogoEmpresaComponent
  ]
})
export class ShareModule { }
