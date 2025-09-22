import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  normativa = {
    id: "",
    urlArchivo: "",
    titulo: "",
    tipoId:"",
    pais:"",
    numero: 0,
    modificacion:"",
    fecha:"",
    entidad:"",
    enlace:"",
    comentarios:"",
  };

  tipo= {
    id: "",
    nombre: ""
  };

  constructor(
    private titleService: Title, private tiposService: TiposNormativasService,
    private normativaService:NormativaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.route.params.subscribe( params => {
      this.normativa.id = params["id"];
    });
    this.normativaService.obtenerNormativa(this.normativa.id).then(respuesta => {
      this.normativa.titulo = respuesta.get("titulo");
      this.normativa.tipoId = respuesta.get("tipoId");
      this.tiposService.obtenerTipo(this.normativa.tipoId).then(rTipo => {
        this.tipo.nombre = rTipo.get("nombre");  
      });
      this.normativa.numero = respuesta.get("numero");
      this.normativa.fecha = respuesta.get("fecha");
      this.normativa.pais = respuesta.get("pais");
      this.normativa.modificacion = respuesta.get("modificacion");
      this.normativa.entidad = respuesta.get("entidad");
      this.normativa.enlace = respuesta.get("enlace");
      this.normativa.comentarios = respuesta.get("comentarios");
      this.normativa.urlArchivo = respuesta.get("urlArchivo");
    });
  }

}
