import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ESTADOS_ARTICULO, TIPOS_USUARIO } from 'src/app/core/services/constantes';
import { MatricesService } from 'src/app/core/services/matrices.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-matriz-articulos-view',
  templateUrl: './matriz-articulos-view.component.html',
  styleUrls: ['./matriz-articulos-view.component.scss']
})
export class MatrizArticulosViewComponent implements OnInit {

  @Input() articulo: any;
  @Input() normativa: any;
  tiposUsuario = TIPOS_USUARIO;
  estados = ESTADOS_ARTICULO;
  tabs = [
    {value: "general", label: "General"},
    {value: "articulos", label: "Artículos"},
    {value: "tramites", label: "Trámites"},
    {value: "cumplimiento", label: "Cumplimiento"},
    {value: "aspectosAmbientales", label: "Riesgos"},
    {value: "cambiosRecientes", label: "Cambios Recientes"}
  ];
  tab = {value: "general", label: "General"};
  usuario: any = {};
  cargando = true;
  reqs: any[] = [];

  constructor(
    private titleService: Title,
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
    private matricesService: MatricesService,
    private usuarioService:UsuarioService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");

    if (this.normativa.requerimientos) {
      this.tabs.push({ value: "requerimientos", label: "Requerimientos" });
    }
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.cargando = false;
    });

    this.reqs = this.articulo.requerimientos
    ? this.articulo.requerimientos.filter((req: any) => this.normativa.requerimientos.map((req: any) => req.id).includes(req))
    : [];
  }

  changeTab(activeTab: any) {
    this.tab = activeTab;
  }

  borrarArticulo() {
    if (confirm("¿Desea eliminar el artículo?")) {
      this.matricesService.borrarArticulo(this.articulo.id).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Artículo borrado con éxito", undefined);
        window.location.reload();
      });
    }
  }

  editarArticulo() {
    this.router.navigate([`/matrices/editar-articulo/${this.articulo.id}`]);
  }

  estadoActual() {
    const estado = this.estados.find(e => e.value === this.articulo.estado);
    if (!estado) return this.estados[4];
    return estado;
  }

  cantidadReq() {
    if (!this.reqs) return 0;

    return this.reqs.filter((req: any) => {
      const existe = this.normativa.requerimientos.find((nr: any) => nr.id === req);
      return !!existe;
    }).length;
  }

  reqCumple(id: string) {
    return this.reqs.map((req: any) => req).includes(id);
  }

  reqCheck(event: any, id: string) {
    const check = event.target.checked;

    if (check) {
      this.reqs.push(id);
    } else {
      this.reqs = this.reqs.filter(req => req !== id);
    }
  }

  actualizarReqs() {
    this.matricesService.editarArticulo({...this.articulo, requerimientos: this.reqs}).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Requerimientos Actualizados", undefined);
    });
  }
}
