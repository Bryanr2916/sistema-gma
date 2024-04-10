import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  empresa = {
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    pais: "",
    urlLogo: "",
    notas: "",
    admin: ""
  };

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private paisesService: PaisesService, private usuarioService:UsuarioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresa.id = params["id"];
    });
    this.empresasService.obtenerEmpresa(this.empresa.id).then( respuesta => {
      this.empresa.nombre = respuesta.get("nombre");
      this.empresa.correo = respuesta.get("correo");
      this.empresa.telefono = respuesta.get("telefono");
      this.empresa.pais = respuesta.get("pais");
      this.empresa.urlLogo = respuesta.get("urlLogo");
      this.empresa.notas = respuesta.get("notas");
      this.empresa.admin = respuesta.get("admin");
    });
  }

}
