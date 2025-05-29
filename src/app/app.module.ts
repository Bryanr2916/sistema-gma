import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './share/share.module';
import { InicioModule } from './inicio/inicio.module';
import { EmpresasModule } from './empresas/empresas.module';
import { MatricesModule } from './matrices/matrices.module';
import { TiposNormativasModule } from './tipos-normativas/tipos-normativas.module';
import { NormativasModule } from './normativas/normativas.module';
import { AreaLegalModule } from './area-legal/area-legal.module';
import { BuscarModule } from './buscar/buscar.module';
import { UsuarioModule } from './usuario/usuario.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

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
    MatricesModule,
    TiposNormativasModule,
    NormativasModule,
    AreaLegalModule,
    BuscarModule,
    UsuarioModule,
    FormsModule,
    ShareModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
