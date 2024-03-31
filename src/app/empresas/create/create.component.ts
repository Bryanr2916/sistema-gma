import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  tabEmpresa = true;
  displayLogo = "";
  archivoLogo:any = null;
 
  paises = this.paisesService.paises;
  
  empresa = {
    nombre: "",
    correo: "",
    telefono: "",
    pais: "",
    urlLogo: "",
    notas: ""
  };

  admin = {
    uid: "",
    nombre: "",
    correo: "",
    contrasena: "",
    repContrasena: "",
    empresaId: "",
    //administrador de empresa
    tipo: 2
  }

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private paisesService: PaisesService, private usuarioService:UsuarioService,
    private toastr: ToastrService, private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
  }

  crearEmpresa() {
    if (this.formularioEsValido()) {
      if (this.archivoLogo) {
        this.empresasService.subirArchivo(this.archivoLogo).then( respuesta => {
          console.log(respuesta);
          this.empresa.urlLogo = respuesta;
          this.crearEmpresaFB();
        });
      } else {
        this.crearEmpresaFB();
      }
    }
  }

  //crear empresa
  crearEmpresaFB() {
    this.empresasService.crearEmpresa(this.empresa).then(rEmpresa => {
      console.log(rEmpresa);
      this.admin.empresaId = rEmpresa.id;
      this.crearAdmin();
    });
  };

  // crea el usuario en firestore
  crearAdmin () {
    this.usuarioService.crearUsuario(this.admin).then(usuario => {
      console.log(usuario);
      this.toastr.success("Empresa creada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(["/empresas"]);
    });
  }

  formularioEsValido() {
    return true;
  }

  cambiarTabEmpresa( valor: boolean) {
    this.tabEmpresa = valor;
  }

  mostrarImagen($event:any) {
    if ($event.target.files) {
      this.archivoLogo = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoLogo);
      reader.onload = (e:any) => {
        this.displayLogo = e.target.result;
      }
    }
  }
}
