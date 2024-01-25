import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { ReestablecerContrasenaComponent } from './reestablecer-contrasena/reestablecer-contrasena.component';

const routes: Routes = [
  {path:'inicio-sesion',component:InicioSesionComponent},
  {path:'reestablecer-contrasena',component:ReestablecerContrasenaComponent},
  {path:':nombre',component:PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
