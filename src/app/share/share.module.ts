import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';
import { TruncarTextoPipe } from './pipes/truncar-texto.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PaginaNoEncontradaComponent,
    TruncarTextoPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    TruncarTextoPipe
  ]
})
export class ShareModule { }
