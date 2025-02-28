import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  cargando = true;
  busqueda = "";

  empresaActual: any = null;
  empresasTodas:any[] = [];
  sucursalesTodas:any[] = [];
  sucursalesFiltradas:any[] = [];
  usuario: any = {
    empresaId: ""
  };
  ths = ["#","Nombre","Tipo", "Acciones"];

  constructor(private titleService: Title, private empresaService: EmpresasService, 
    private usuarioService: UsuarioService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Sucursales");

    this.usuarioService.usuarioActual().subscribe( usuarioActivo => {
      if (usuarioActivo) { 
        this.usuarioService.usuarioActualFS(usuarioActivo.uid).then(respuseta => {
          const usuarioUID = respuseta.docs[0].data();
          console.log("usuarioUID: ", usuarioUID);
          if (usuarioUID) {
            this.usuario = usuarioUID
            this.empresaService.obtenerEmpresas().subscribe(respusetaEmp => {
              this.empresasTodas = respusetaEmp;
              this.empresaActual = this.empresasTodas.find(emp => emp.id === this.usuario.empresaId);
              if ("sucursales" in this.empresaActual) {
                this.sucursalesTodas = this.empresaActual.sucursales.map((suc: string) => this.obtenerNombreSucursal(suc));
                this.sucursalesFiltradas = this.sucursalesTodas;
              }
              this.cargando = false;
            });
          }
        });
      } else {
        this.usuario.empresaId = "";
      }
    });
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.sucursalesFiltradas = this.sucursalesTodas.filter(sucursal => 
      sucursal.toLowerCase().includes(busquedaMinuscuala));
  }

  obtenerNombreSucursal(id: string) {
    return this.empresasTodas.find(emp => emp.id === id).nombre;
  }

  usarComo(id: number) {
    //todo: logica usar como
  }


}
