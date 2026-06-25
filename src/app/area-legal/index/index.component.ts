import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  cargando = true;
  busqueda = "";
  areasTodas:any[] = [];
  areasFiltradas:any[] = [];
  ths = ["#","Nombre"];
  filaSeleccionada = -1;

  constructor(private titleService: Title, private areaLegalService: AreaLegalService,
    private mensajesService: MensajesService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
    this.areaLegalService.obtenerAreas().subscribe(datos => {
      this.areasTodas = datos;
      this.areasFiltradas = this.areasTodas;
      this.cargando = false;
    });
  }

   buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.areasFiltradas = this.areasTodas.filter(area => 
      area.nombre.toLowerCase().includes(busquedaMinuscuala));
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
      const area = this.areasFiltradas[this.filaSeleccionada];
      if (confirm(`¿Desea eliminar el área "${area.nombre}"?`)) {
        this.areaLegalService.borrarArea(area.id).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Área borrada con éxito", undefined);
        }).finally(() => {
          this.filaSeleccionada = -1;
        });
      }
    }
   }

   editarFila() {
    if (this.filaSeleccionada !== -1) {
      const area = this.areasFiltradas[this.filaSeleccionada];
      this.router.navigate([`/area-legal/editar/${area.id}`]);
    }
   }

}
