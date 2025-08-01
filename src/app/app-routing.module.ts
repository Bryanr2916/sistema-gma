import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './inicio/index/index.component';
import { PaginaNoEncontradaComponent } from './share/pagina-no-encontrada/pagina-no-encontrada.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TipoGuard } from './core/guards/tipo.guard';
import { UsuarioGuard } from './core/guards/usuario.guard';

const routes: Routes = [
  {path:'',component:IndexComponent,pathMatch:'full', ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))},
  { path:'area-legal',
    loadChildren: () => import ('./area-legal/area-legal.module').then( m => m.AreaLegalModule),
    canActivate: [TipoGuard],
    data: { tipo: 1}
  },
  { path:'buscar',
    loadChildren: () => import ('./buscar/buscar.module').then( m => m.BuscarModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'empresas',
    loadChildren: () => import ('./empresas/empresas.module').then( m => m.EmpresasModule),
    canActivate: [TipoGuard],
    data: { tipo: 1}
  },
  { path:'empresa',
    loadChildren: () => import ('./empresa/empresa.module').then( m => m.EmpresaModule),
    canActivate: [TipoGuard],
    data: { tipo: 2}
  },
  { path:'matrices',
    loadChildren: () => import ('./matrices/matrices.module').then( m => m.MatricesModule),
    ...canActivate(() => redirectUnauthorizedTo(["usuario/inicio-sesion"]))
  },
  { path:'normativas',
    loadChildren: () => import ('./normativas/normativas.module').then( m => m.NormativasModule),
    canActivate: [TipoGuard],
    data: { tipo: 1}
  },
  { path:'tipos-normativas',
    loadChildren: () => import ('./tipos-normativas/tipos-normativas.module').then( m => m.TiposNormativasModule),
    canActivate: [TipoGuard],
    data: { tipo: 1}
  },
  { path:'usuario',
    loadChildren: () => import ('./usuario/usuario.module').then( m => m.UsuarioModule)
  },
  {path:'**',component:PaginaNoEncontradaComponent, canActivate: [UsuarioGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
