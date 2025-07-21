import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  
  cargando = true;
  busqueda = "";
  tiposTodos:any[] = [];
  tiposFiltrados:any[] = [];
  ths = ["#","Tipos de Normativas", "Acciones"];

  constructor(private titleService: Title, private tiposService: TiposNormativasService, private mensajesService: MensajesService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
    this.tiposService.obtenerTipos().subscribe(datos => {
      this.tiposTodos = datos;
      this.tiposFiltrados = this.tiposTodos;
      this.cargando = false;
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.tiposFiltrados = this.tiposTodos.filter(tipo => 
      tipo.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  borrar(tipo: any) {
    if (confirm(`¿Desea eliminar el área "${tipo.nombre}"?`)) {
      this.tiposService.borrarTipo(tipo.id).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Área borrada con éxito", undefined);
      });
    }
  }
}
