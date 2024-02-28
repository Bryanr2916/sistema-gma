import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  cargando = true;
  busqueda = "";
  ths = ["#","Empresa", "Administrador", "Correo Electrónico", "Acciones"];
  empresasTodas:any[] = [];
  empresasFiltradas:any[] = [];

  constructor(private titleService: Title, private empresaService: EmpresasService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos;
      this.empresasFiltradas = this.empresasTodas;
      this.cargando = false;
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.empresasFiltradas = this.empresasTodas.filter(empresa => 
      empresa.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  borrar(empresa: any) {
    if (confirm(`¿Desea eliminar la empresa "${empresa.nombre}"?`)) {
      console.log("borrando" + empresa);
      this.empresaService.borrarEmpresa(empresa.id).then(_ => {
        this.toastr.success("Empresa borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
    }
  }

  usarComo (empresa: any) {
    console.log("usar como: ", empresa);
  }

  duplicar (empresa: any) {
    console.log("duplicar: ", empresa);
  }

}
