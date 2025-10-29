import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-usuarios-view',
  templateUrl: './usuarios-view.component.html',
  styleUrls: ['./usuarios-view.component.scss']
})
export class UsuariosViewComponent implements OnInit {
  tiposUsuario = TIPOS_USUARIO;
  empresa: any = {};

  cargando: boolean = true;

  usuario: any = {};

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private empresasService: EmpresasService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe(params => {
      this.usuario.id = params["id"];
    });

    this.usuarioService.obtenerUsuario(this.usuario.id).then(respuesta => {
      this.usuario = { ...this.usuario, ...respuesta.data() }
      this.cargarEmpresa();
    });
  }

  async cargarEmpresa() {
    const empresaFB = await this.empresasService.obtenerEmpresa(this.usuario.empresaId);
    if (empresaFB.exists()) {
      this.empresa = { ...this.empresa, ...empresaFB.data()};
    }
    this.cargando = false;
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
}
