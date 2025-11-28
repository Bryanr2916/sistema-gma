import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { EncriptadorService } from 'src/app/core/services/encriptador.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-gestionar-usuarios',
  templateUrl: './gestionar-usuarios.component.html',
  styleUrls: ['./gestionar-usuarios.component.scss']
})
export class GestionarUsuariosComponent implements OnInit {

  cargando = true;
  busqueda = "";
  ths = ["#","Nombre", "Correo", "Tipo", "Acciones"];
  usuariosTodos:any[] = [];
  usuariosFiltrados:any[] = [];
  usuario: any = {};
  empresa = {
    id: "",
    nombre: ""
  };

  constructor(private titleService: Title, private usuarioService: UsuarioService,
    private empresasService:EmpresasService, private mensajesService: MensajesService,
    private route: ActivatedRoute, private encriptadorService: EncriptadorService, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.usuarioService.usuarioActual().subscribe(usuario => {
      this.usuario = usuario;
      this.empresa.id = usuario?.['empresaId'];

      this.cargarDatos();
    });
  }

  cargarDatos = async () => {
    const reEmpresa = await this.empresasService.obtenerEmpresa(this.empresa.id);
    const datosEmpresa = reEmpresa.data();

    if (datosEmpresa) {
      this.empresa.nombre = datosEmpresa['nombre']; 
    } else {
      //todo: empresa no existe
    }

    const reUsuarios = await this.usuarioService.obtenerUsuarioPorEmpresa(this.empresa.id);

    if (reUsuarios) {
      this.usuariosTodos = reUsuarios.docs.map(usDoc => (
        {...usDoc.data(), id: usDoc.id}
      ));
      this.usuariosFiltrados = this.usuariosTodos;
      this.cargando = false;
    }
  };

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.usuariosFiltrados = this.usuariosTodos.filter(usuario => 
      usuario.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

  mostrarTipo(tipo: number) {
    switch(tipo) {
      case 1:
      case 2:  
        return "Administrador"
      case 3:
        return "Editor"
      default:
        return "Lector"
    }
  }

  claseTipo(tipo: number) {
    switch(tipo) {
      case 1:
      case 2:  
        return "badge bg-success"
      case 3:
        return "badge bg-primary"
      default:
        return "badge bg-secondary"
    }
  }

  // iniciar sesión o registrar
  realizarAccion(uid: string, datos: any) {
    if (uid !== "") return this.usuarioService.iniciarSesion(datos);
    return this.usuarioService.registrar(datos);
  }

  usarComo(usuario: any) {
    if (confirm(`Al aceptar se cerrará la sesión actual e iniciará sesión como "${usuario.correo}"`)) {
      console.log("usuario: ", usuario);
      this.realizarAccion(
        usuario.uid,
        {
          correo: usuario.correo,
          contrasena: this.encriptadorService.desencriptarContrasena(usuario.contrasena)
        }
      ).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Bienvenido(a) a GMA Sistema", undefined);
        this.router.navigate([""]);
      }).catch(_ => {
        this.mensajesService.mostrarMensaje("error", "No se pudo iniciar sesión", undefined);
      });
    }
  }
 
  borrar(usuario: any) {
    if (confirm(`¿Desea eliminar a "${usuario.nombre}"?`)) {
      this.usuarioService.borrarUsuario(usuario.id).then(_ => {
        this.usuariosTodos = this.usuariosTodos.filter(us => us.id !== usuario.id);
        this.usuariosFiltrados = this.usuariosFiltrados.filter(us => us.id !== usuario.id);
        this.mensajesService.mostrarMensaje("success", "Usuario borrado con éxito", undefined);
      });
    }
  }
}
