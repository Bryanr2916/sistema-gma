import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
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
  usuarios:any[] = [];
  ths = ["#","Nombre","Tipo", "Acciones"];

  constructor(private titleService: Title, private empresaService: EmpresasService, 
    private usuarioService: UsuarioService ,private toastr: ToastrService,
  private router: Router, private encriptador: EncriptadorService) { }

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
                this.sucursalesTodas = this.empresaActual.sucursales;
                this.sucursalesFiltradas = this.sucursalesTodas;
              }
              this.cargando = false;
            });
          }
        });
      } else {
        this.usuario.empresaId = "";
      }

      this.cargarUsuarios();
    });
  }

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(datos => {
      this.cargando = false;
      this.usuarios = datos;
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

  async usarComo (id: any) {
    const usuarioAdmin = this.usuarios.find( usuario => usuario.empresaId === id);
    if (usuarioAdmin) {
      if (confirm(`Al aceptar se cerrará la sesión actual e iniciará sesión como ${usuarioAdmin.correo}`)){
        this.usuarioService.iniciarSesion({
          correo: usuarioAdmin.correo, contrasena: this.encriptador.desencriptarContrasena(usuarioAdmin.contrasena)
        }).then( _ => {
          this.router.navigate([""]);
          this.toastr.success("Bienvenido(a) a GMA Sistema", undefined, {
            closeButton: true,
            timeOut: 4000,
            progressBar: true
          });
        }).catch(error => {
          this.toastr.error("No se pudo iniciar sesión", undefined, {
            closeButton: true,
            timeOut: 4000,
            progressBar: true
          });
          console.log("error: ", error);    
        }); 
      }
    } else {
      this.toastr.warning("No se encontró administrador", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      })
    }
  }

}
