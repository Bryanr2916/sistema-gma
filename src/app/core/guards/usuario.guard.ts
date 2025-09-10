import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  usuarioService: UsuarioService = inject(UsuarioService);
  toastr: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>{
    const usuario = await firstValueFrom(this.usuarioService.usuarioAuthActual());
    if (!usuario) {
      this.router.navigate(["/usuario/inicio-sesion"]);
      return false;
    }

    return true;
  }
  
}
