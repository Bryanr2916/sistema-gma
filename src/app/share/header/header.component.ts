import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    this.usuarioService.usuarioActual().subscribe( usuarioActivo => {
      if (usuarioActivo) { 
        this.usuarioService.usuarioActualFS(usuarioActivo.uid).then(respuesta => {
          const usuarioFS = respuesta.docs[0];
          if (usuarioFS) {
            const usuarioUID = respuesta.docs[0].data();
            if ( usuarioUID) {
              this.usuario = usuarioUID
              this.cargando = false;
            }
          }
        });
      } else {
        this.usuario.correo = "";
      }
    });
  }

  cerrarSesion() {
    if (confirm("¿Desea cerrar sesión?")) {
      this.usuarioService.cerrarSesion().then(() => {
        this.usuario = {};
        this.mensajesService.mostrarMensaje("success", "Ha cerrado sesión de forma exitosa", undefined);
        this.router.navigate(["usuario/inicio-sesion"])
      }).catch(error => console.log(error));
    }
  }

  usuarioVacio() {
    return Object.keys(this.usuario).length === 1;
  }

}
