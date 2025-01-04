import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
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
  articulosAplicables: any[] = [];
  ths = ["#","Título","Artículos","Empresa","Acciones"];

  constructor(
    private titleService: Title,
    private empresasService: EmpresasService,
    private matricesService: MatricesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.empresasService.obtenerEmpresas().subscribe(datos => {
      this.empresas = datos;
      this.cargarMatrices();
    });
  }

  async cargarMatrices() {
    this.matricesService.obtenerMatrices().subscribe(async datos => {
      this.matricesTodas = datos;
      this.matricesFiltradas = this.matricesTodas;
      this.articulosAplicables = (await this.matricesService.obtenerArticulosAplicables()).docs.map((value) => { return {id: value.id, ...value.data() };});
      this.cargando = false;
    });
  }

  nombreEmpresa (id: string) {
    return this.empresas.find(emp => emp.id === id).nombre
  }

  obtenerCantidadArticulosAplicables(matrizId: string) {
    return this.articulosAplicables.filter(aa => {
      return aa.matrizId === matrizId;
    }).length;
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    console.log(this.matricesTodas[0]);
    this.matricesFiltradas = this.matricesTodas.filter(matriz => 
      matriz.titulo.toLowerCase().includes(busquedaMinuscuala) ||
      this.nombreEmpresa(matriz.empresa).includes(busquedaMinuscuala));
  }

  borrar(matriz: any) {
    if (confirm("¿Desea eliminar la matriz?")) {
      this.matricesService.borrarMatriz(matriz.id).then(_ => {
        this.toastr.success("Matriz borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
    }
    
  }

}
