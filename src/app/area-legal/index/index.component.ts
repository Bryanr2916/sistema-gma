import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  busqueda = "";
  areasTodas:any[] = [];
  areasFiltradas:any[] = [];
  acciones= ["Editar |", "Borrar"]
  ths = ["#","Nombre", "Acciones"];

  constructor(private titleService: Title, private areaLegalService: AreaLegalService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
    this.areaLegalService.obtenerAreas().subscribe(datos => {
      this.areasTodas = datos;
      this.areasFiltradas = this.areasTodas;
    })
  }

   buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.areasFiltradas = this.areasTodas.filter(area => 
      area.nombre.toLowerCase().includes(busquedaMinuscuala));
   }

}
