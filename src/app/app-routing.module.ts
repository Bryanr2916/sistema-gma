import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './inicio/index/index.component';
import { PaginaNoEncontradaComponent } from './share/pagina-no-encontrada/pagina-no-encontrada.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const routes: Routes = [
  {path:'',component:IndexComponent,pathMatch:'full', ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))},
  { path:'area-legal',
    loadChildren: () => import ('./area-legal/area-legal.module').then( m => m.AreaLegalModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'buscar',
    loadChildren: () => import ('./buscar/buscar.module').then( m => m.BuscarModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'empresas',
    loadChildren: () => import ('./empresas/empresas.module').then( m => m.EmpresasModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'matrices',
    loadChildren: () => import ('./matrices/matrices.module').then( m => m.MatricesModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'normativas',
    loadChildren: () => import ('./normativas/normativas.module').then( m => m.NormativasModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'sucursales',
    loadChildren: () => import ('./sucursales/sucursales.module').then( m => m.SucursalesModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'tipos-normativas',
    loadChildren: () => import ('./tipos-normativas/tipos-normativas.module').then( m => m.TiposNormativasModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'usuario',
    loadChildren: () => import ('./usuario/usuario.module').then( m => m.UsuarioModule)
  },
  {path:'**',component:PaginaNoEncontradaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
