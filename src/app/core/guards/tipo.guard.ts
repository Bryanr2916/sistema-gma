import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TipoGuard implements CanActivate {
  usuarioService: UsuarioService = inject(UsuarioService);
  toastr: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>{
    const tiposEsperado = route.data['tipos'];
    const usuario = await firstValueFrom(this.usuarioService.usuarioAuthActual());
    if (!usuario) {
      this.router.navigate(["/usuario/inicio-sesion"]);
      return false;
    }

    
    const respuesta = await this.usuarioService.usuarioActualFS(usuario?.uid || "");
    const usuarioUID = respuesta.docs[0].data();
      if (usuarioUID) {

        if (!tiposEsperado.includes(usuarioUID['tipo'])){
          this.toastr.error("Su usuario no tiene permisos para acceder a esta página", "Acceso Denegado", {
            closeButton: true,
            timeOut: 4000,
            progressBar: true
          });
          this.router.navigate(["/"]);
        }
        return tiposEsperado.includes(usuarioUID['tipo']);
      }
      return false;
  }
  
}
