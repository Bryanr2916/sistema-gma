import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
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
  empresa: any = {}
  constructor(
    private usuarioService: UsuarioService, private mensajesService: MensajesService,
    private router: Router, private empresasService: EmpresasService
  ) { }

  ngOnInit(): void {
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;

      if (this.usuario?.empresaId) {
        this.empresasService.obtenerEmpresa(this.usuario.empresaId).then(empresa => {
          if (empresa.exists()) {
            this.empresa = { id: empresa.id, ...empresa.data() };
            this.cargando = false;
          }
        });
      } else {
        this.empresa = {
          nombre: "GMA Sistema",
          urlLogo: "../assets/images/GMA-logo.png"
        };
        this.cargando = false;
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
    return !this.usuario || Object.keys(this.usuario).length === 0;
  }

}
