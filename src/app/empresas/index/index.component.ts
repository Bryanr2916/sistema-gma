import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

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
  usuarios:any[] = [];

  constructor(
    private titleService: Title, private empresaService: EmpresasService,
    private toastr: ToastrService, private usuarioService: UsuarioService,
    private router: Router, private encriptador: EncriptadorService, private empresasService:EmpresasService) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.empresaService.obtenerEmpresas().subscribe(datos => {
      this.empresasTodas = datos;
      this.empresasFiltradas = this.empresasTodas;
      this.cargarUsuarios()
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
    this.empresasFiltradas = this.empresasTodas.filter(empresa => 
      empresa.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  async borrarImagenActual(urlLogo: string) {
    if (urlLogo !== "") {
      await this.empresasService.borrarArchivo(urlLogo);
    }
  }

  borrarEmpresaFB(empresa: any) {
    this.empresaService.borrarEmpresa(empresa.id).then(_ => {
        this.toastr.success("Empresa borrada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
      });
  }

  borrar(empresa: any) {
    if (confirm(`¿Desea eliminar la empresa "${empresa.nombre}"?`)) {

      if (empresa.urlLogo) {
        this.borrarImagenActual(empresa.urlLogo).then(_ => {
          this.borrarEmpresaFB(empresa);
        });
      } else {
        this.borrarEmpresaFB(empresa);
      }
    }
  }

  async usarComo (empresa: any) {
    const usuarioAdmin = this.usuarios.find( usuario => usuario.empresaId === empresa.id);
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

  duplicar (empresa: any) {
    const empDuplicada = {...empresa, nombre: `copia de ${empresa.nombre}`, urlLogo: ""};

    this.empresasService.crearEmpresa(empDuplicada).then(_ => {
      this.toastr.success("Empresa creada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
    });
  }

  usuarioAdmin(empresa: any) {
    return this.usuarios.find( usuario => usuario.empresaId === empresa.id)?.correo;
  }

}
