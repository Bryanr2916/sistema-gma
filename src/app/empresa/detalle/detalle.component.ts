import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  empresa = {
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    pais: "",
    paises: "",
    urlLogo: "",
    notas: "",
    admin: ""
  };

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresa");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      if (usuario?.['empresaId']) {
        this.empresa.id = usuario['empresaId'];
        this.cargarEmpresa();
      }
    });
  }

  cargarEmpresa = async () => {
    const respuesta = await this.empresasService.obtenerEmpresa(this.empresa.id);
    this.empresa.nombre = respuesta.get("nombre");
    this.empresa.correo = respuesta.get("correo");
    this.empresa.telefono = respuesta.get("telefono");
    this.empresa.pais = respuesta.get("pais");
    this.empresa.paises = respuesta.get("paises");
    this.empresa.urlLogo = respuesta.get("urlLogo");
    this.empresa.notas = respuesta.get("notas");
    this.empresa.admin = respuesta.get("admin");
  }

}
