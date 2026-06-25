import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
  ths = ["#","Tipos de Normativas"];
  filaSeleccionada = -1;

  constructor(private titleService: Title, private tiposService: TiposNormativasService,
    private mensajesService: MensajesService, private router: Router) { }

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

  seleccionarFila(event: Event, index: number) {
    event.stopPropagation();
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.filaSeleccionada = index;
    } else {
      this.filaSeleccionada = -1;
    }
  }

  borrarFila() {
    if (this.filaSeleccionada !== -1) {
      const tipo = this.tiposFiltrados[this.filaSeleccionada];
      if (confirm(`¿Desea eliminar el tipo "${tipo.nombre}"?`)) {
        this.tiposService.borrarTipo(tipo.id).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Tipo borrado con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
  }

  editarFila() {
    if (this.filaSeleccionada !== -1) {
      const tipo = this.tiposFiltrados[this.filaSeleccionada];
      this.router.navigate([`/tipos-normativas/editar/${tipo.id}`]);
    }
  }
}
