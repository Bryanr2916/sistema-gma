import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { ReestablecerContrasenaComponent } from './reestablecer-contrasena/reestablecer-contrasena.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';

const routes: Routes = [
  {path:'inicio-sesion',component:InicioSesionComponent, ...canActivate(() => redirectLoggedInTo([""]))},
  {path:'reestablecer-contrasena',component:ReestablecerContrasenaComponent, ...canActivate(() => redirectLoggedInTo([""]))},
  {path:'perfil',component:PerfilComponent, ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))},
  { path: 'perfil-edit', component: PerfilEditComponent, ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"])) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
