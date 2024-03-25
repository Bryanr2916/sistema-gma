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
  empresasTodas:any[] = [];
  empresasFiltradas:any[] = [];
  empresasVinculadas:any[] = [];


  constructor(private titleService: Title, private empresaService: EmpresasService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Sucursales");
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos.map(emp => {
        return {sucursales: [],...emp};
      });
      this.empresasFiltradas = this.empresasTodas;
      this.cargando = false;

      this.empresasVinculadas = this.empresasTodas.map(emp => {
        return { id: emp.id, sucursales: emp.sucursales || []}
      });
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.empresasFiltradas = this.empresasTodas.filter(empresa => 
      empresa.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  usarComo (empresa: any) {
    console.log("usar como: ", empresa);
  }

  esSubsidiaria (empresaId: string, sucursales: any[] | undefined) {
    if (!sucursales) {
      return false
    };

    return sucursales.includes(empresaId);
  }

  // filtra las empresas para no tener la empresa misma
  obtenerSubsidiarias (empresaId: string) {
    return this.empresasTodas.filter(emp => emp.id !== empresaId);
  }

  seleccionarSubsidiaria(empresa: any, subsidiaria: any, event: any) {
    const empresaIndex = this.empresasVinculadas.findIndex( emp => emp.id === empresa.id); 
    const sucursalIndex = this.empresasVinculadas[empresaIndex].sucursales.findIndex( (suc: any) => 
      suc === subsidiaria.id);
    if (event.target.checked) {
      this.empresasVinculadas[empresaIndex].sucursales.push(subsidiaria.id);
      console.log("vincular");
    } else {
      this.empresasVinculadas[empresaIndex].sucursales.splice(sucursalIndex, 1);
      console.log("desvincular");
    }
  }

  actualizarSucursales(empresa: any) {
    this.empresaService.editarEmpresa(empresa).then(_ => {
      this.toastr.success("Subsidiarias actualizadas con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
    });
  }

}
