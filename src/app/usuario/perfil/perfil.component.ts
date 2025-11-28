import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  tiposUsuario = TIPOS_USUARIO;
  cargando = true;
  usuario: any = {};
  nombreEmpresa = ""
  tipos: any = {};

  constructor(
    private titleService: Title,
    private usuarioService: UsuarioService,
    private empresasService: EmpresasService,
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Perfil");
    this.tipos = this.usuarioService.tiposSelect();
    
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargando = false;
      if (this.usuario.tipo !== TIPOS_USUARIO.adminSistema) {
        this.cargarEmpresa();
      } else {
        this.nombreEmpresa = "GMA Sistema";
        this.cargando = false;
      }
    });
  }

  async cargarEmpresa() {
    const empresaFB = await this.empresasService.obtenerEmpresa(this.usuario.empresaId);
    if (empresaFB.exists()) {
      this.nombreEmpresa = empresaFB.data()["nombre"];
    }
    this.cargando = false;
  }

  claseTipo(tipo: number) {
    switch (tipo) {
      case 1:
      case 2:
        return "badge bg-success"
      case 3:
        return "badge bg-primary"
      default:
        return "badge bg-secondary"
    }
  }

  mostrarTipo(tipo: number) {
    switch (tipo) {
      case 1:
        return "Administrador de Sistema";
      case 2:
        return "Administrador de Empresa"
      case 3:
        return "Editor"
      default:
        return "Lector"
    }
  }

  reestablecerContrasena() {
    this.usuarioService.reestablecerContrasena(this.usuario.correo).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Correo enviado", "Reestablecer contraseña");
    }).catch(_ => {
      this.mensajesService.mostrarMensaje("error", "Correo inválido", "Error");
    });
  }

  editarPerfil() {
    this.router.navigate(["/usuario/perfil-edit"]);
  }
}
