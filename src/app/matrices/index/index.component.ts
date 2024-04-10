import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MatricesService } from 'src/app/core/services/matrices.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  busqueda = "";
  empresas:any[] = [];
  matricesTodas:any[] = [];
  matricesFiltradas:any[] = [];
  ths = ["#","Título","Empresa","Acciones"];

  constructor(
    private titleService: Title,
    private empresasService: EmpresasService,
    private matricesService: MatricesService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.empresasService.obtenerEmpresas().subscribe(datos => {
      this.empresas = datos;
      this.cargarMatrices();
    });
  }

  cargarMatrices() {
    this.matricesService.obtenerMatrices().subscribe(datos => {
      this.matricesTodas = datos;
      this.matricesFiltradas = this.matricesTodas;
      this.cargando = false;
    });
  }

  nombreEmpresa (id: string) {
    return this.empresas.find(emp => emp.id === id).nombre
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    console.log(this.matricesTodas[0]);
    this.matricesFiltradas = this.matricesTodas.filter(matriz => 
      matriz.titulo.toLowerCase().includes(busquedaMinuscuala) ||
      this.nombreEmpresa(matriz.empresa).includes(busquedaMinuscuala));
  }

  borrar(matriz: any) {
    console.log("borrando...", matriz);
  }

}
