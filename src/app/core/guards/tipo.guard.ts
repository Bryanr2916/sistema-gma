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
    const tipoEsperado = route.data['tipo'];
    const usuario = await firstValueFrom(this.usuarioService.usuarioActual());
    if (!usuario) {
      this.router.navigate(["/usuario/inicio-sesion"]);
      return false;
    }
    const respuesta = await this.usuarioService.usuarioActualFS(usuario?.uid || "");
    const usuarioUID = respuesta.docs[0].data();
    console.log("usuario: ", usuario);
      if (usuarioUID) {

        if (usuarioUID['tipo'] !== tipoEsperado){
          this.toastr.error("Su usuario no tiene permisos para acceder a esta página", "Acceso Denegado", {
            closeButton: true,
            timeOut: 4000,
            progressBar: true
          });
          this.router.navigate(["/"]);
        }
        return usuarioUID['tipo'] === tipoEsperado;
      }
      return false;
  }
  
}
