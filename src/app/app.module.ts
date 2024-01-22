import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { InicioModule } from './inicio/inicio.module';
import { EmpresasModule } from './empresas/empresas.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { MatricesModule } from './matrices/matrices.module';
import { TiposNormativasModule } from './tipos-normativas/tipos-normativas.module';
import { NormativasModule } from './normativas/normativas.module';
import { AreaLegalModule } from './area-legal/area-legal.module';
import { BuscarModule } from './buscar/buscar.module';
import { UsuarioModule } from './usuario/usuario.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    ShareModule,
    InicioModule,
    EmpresasModule,
    SucursalesModule,
    MatricesModule,
    TiposNormativasModule,
    NormativasModule,
    AreaLegalModule,
    BuscarModule,
    UsuarioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
