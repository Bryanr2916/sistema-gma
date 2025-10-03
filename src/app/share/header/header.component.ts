import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  tiposUsuario = TIPOS_USUARIO;
  cargando = true;
  usuario: any = {};
  constructor(
    private usuarioService: UsuarioService, private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargando = false;
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
    return !this.usuario || Object.keys(this.usuario).length === 0;
  }

}
