import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-matriz-articulos-view',
  templateUrl: './matriz-articulos-view.component.html',
  styleUrls: ['./matriz-articulos-view.component.scss']
})
export class MatrizArticulosViewComponent implements OnInit {

  @Input() articulo: any;
  @Input() normativa: any;
  tabs = [
    {value: "general", label: "General"},
    {value: "articulos", label: "Artículos"},
    {value: "tramites", label: "Trámites"},
    {value: "cumplimiento", label: "Cumplimiento"},
    {value: "aspectosAmbientales", label: "Riesgos"},
    {value: "cambiosRecientes", label: "Cambios Recientes"}
  ];
  tab = {value: "general", label: "General"};

  constructor(
    private titleService: Title,
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
  }

  changeTab(activeTab: any) {
    this.tab = activeTab;
  }

  borrarArticulo() {
    if (confirm("¿Desea eliminar el artículo?")) {
      console.log("eliminando...");
    }
  }

  editarArticulo() {
    this.router.navigate([`/matrices/editar-articulo/${this.articulo.id}`]);
  }
}
