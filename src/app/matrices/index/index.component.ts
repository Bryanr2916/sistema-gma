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
  empresasTodas:any[] = [];
  empresasMatrices: any[] = [];
  empresasFiltradas:any[] = [];
  matrices:any[] = [];

  constructor(
    private titleService: Title,
    private empresasService: EmpresasService,
    private matricesService: MatricesService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Matrices");
    this.empresasService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos;
      this.cargarMatrices();
    });
  }

  cargarMatrices() {
    this.matricesService.obtenerMatrices().subscribe(datos => {
      this.matrices = datos;
      this.cargando = false;
    });
  }

  nombreEmpresa (id: string) {
    return this.empresasTodas.find(emp => emp.id === id).nombre
  }

}
