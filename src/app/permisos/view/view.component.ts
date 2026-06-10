import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ESTADOS_PERMISO, TIPOS_PERMISO } from 'src/app/core/services/constantes';
import { PermisosService } from 'src/app/core/services/permisos.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  permiso: any = {
    nombre: "",
    tipo: "",
    fechaVencimiento: "",
    urlArchivo: "",
    estado: ""
  }

  estados = ESTADOS_PERMISO;
  tipos: any[] = TIPOS_PERMISO;

  cargando = true;

  constructor(
    private titleService: Title,
    private permisosService:PermisosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Permisos");

    this.route.params.subscribe(params => {
      this.permiso.id = params["id"];
      this.permisosService.obtenerPermiso(this.permiso.id).then(respuesta => {

        this.permiso.nombre = respuesta.get("nombre");
        this.permiso.tipo = respuesta.get("tipo");
        this.permiso.fechaVencimiento = respuesta.get("fechaVencimiento");
        this.permiso.urlArchivo = respuesta.get("urlArchivo");
        this.permiso.estado = respuesta.get("estado");
        this.permiso.correos = respuesta.get("correos");

        this.cargando = false;
      });
    });
  }

  obtenerEstado(estado: string) {
    const estadoActual = this.estados.find(es => es.key === estado);

    return estadoActual || this.estados[this.estados.length - 1];
  }

  obtenerTipo(tipo: string) {
    const tipoActual = this.tipos.find(tp => tp.key === tipo);

    return tipoActual;
  }

}
