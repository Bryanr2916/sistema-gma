import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  tooltip: any;
  cargando = true;
  busqueda = "";
  areasTodas:any[] = [];
  areasFiltradas:any[] = [];
  ths = ["#","Nombre", "Acciones"];

  constructor(private titleService: Title, private areaLegalService: AreaLegalService,
    private toastr: ToastrService) { }

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

   borrar(area: any) {
    if (confirm(`¿Desea eliminar el área "${area.nombre}"?`)) {
      console.log("borrando" + area);
      this.areaLegalService.borrarArea(area.id).then(_ => {
        this.toastr.success("Área borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
    }
   }

}
