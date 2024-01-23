import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './inicio/index/index.component';

const routes: Routes = [
  {path:'',component:IndexComponent,pathMatch:'full'},
  { path:'area-legal',
    loadChildren: () => import ('./area-legal/area-legal.module').then( m => m.AreaLegalModule)
  },
  { path:'buscar',
    loadChildren: () => import ('./buscar/buscar.module').then( m => m.BuscarModule)
  },
  { path:'empresas',
    loadChildren: () => import ('./empresas/empresas.module').then( m => m.EmpresasModule)
  },
  { path:'empresas',
    loadChildren: () => import ('./empresas/empresas.module').then( m => m.EmpresasModule)
  },
  { path:'matrices',
    loadChildren: () => import ('./matrices/matrices.module').then( m => m.MatricesModule)
  },
  { path:'normativas',
    loadChildren: () => import ('./normativas/normativas.module').then( m => m.NormativasModule)
  },
  { path:'sucursales',
    loadChildren: () => import ('./sucursales/sucursales.module').then( m => m.SucursalesModule)
  },
  { path:'tipos-normativas',
    loadChildren: () => import ('./tipos-normativas/tipos-normativas.module').then( m => m.TiposNormativasModule)
  },
  { path:'usuario',
    loadChildren: () => import ('./usuario/usuario.module').then( m => m.UsuarioModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
