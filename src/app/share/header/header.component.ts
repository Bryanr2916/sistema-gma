import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cargando = true;
  usuario: any = {};
  constructor(
    private usuarioService: UsuarioService, private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuarioActual().pipe(
      switchMap(usuarioActivo => {
        if (!usuarioActivo) return of(null);
        return this.usuarioService.usuarioActualFSS(usuarioActivo.uid);
      })
    ).subscribe( usuarioActivo => {
      if (usuarioActivo) {
        this.usuario = usuarioActivo.length > 0 ? usuarioActivo[0] : {};
        if (usuarioActivo.length === 0) {
          this.router.navigate(["usuario/inicio-sesion"])
        }
        this.cargando = false;
      } else {
        this.usuario = {};
        this.cargando = false;
        this.router.navigate(["usuario/inicio-sesion"])
      }
    });
  }

  cerrarSesion() {
    if (confirm("¿Desea cerrar sesión?")) {
      this.usuarioService.cerrarSesion().then(() => {
        this.mensajesService.mostrarMensaje("success", "Ha cerrado sesión de forma exitosa", undefined);
        this.router.navigate(["usuario/inicio-sesion"])
      }).catch(error => console.log(error));
    }
  }

  usuarioVacio() {
    return Object.keys(this.usuario).length === 0;
  }

}
