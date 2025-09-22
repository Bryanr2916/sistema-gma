import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  displayLogo = "";
  archivoLogo:any = null;
  archivoNuevo:any = null;
 
  paises = this.paisesService.paises;
  
  empresa = {
    id: "",
    nombre: "",
    correo: "",
    telefono: "",
    paises: [],
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
    private mensajesService: MensajesService, private router: Router,
    private route: ActivatedRoute, public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresa.id = params["id"];
    });

    this.obtenerEmpresa();
  }

  definirFormulario() {
    this.formulario = this.fb.group({
      nombre: ["", [Validators.required]],
      correo: ["", [Validators.required, Validators.email]],
      telefono: ["", [Validators.required]],
      paises: ["", [Validators.required, seleccionVacia()]],
      notas: ["", []]
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  obtenerEmpresa = async () => {
    const respuesta = await this.empresasService.obtenerEmpresa(this.empresa.id);
    const datosEmpresa = respuesta.data();
    if (datosEmpresa) {
      this.formulario.controls["correo"].setValue(datosEmpresa['correo']);
      this.formulario.controls["nombre"].setValue(datosEmpresa['nombre']);
      this.formulario.controls["telefono"].setValue(datosEmpresa['telefono']);
      this.formulario.controls["paises"].setValue(datosEmpresa['paises']);
      this.formulario.controls["notas"].setValue(datosEmpresa['notas']);
      
      this.empresa.correo = datosEmpresa['correo'];
      this.empresa.nombre = datosEmpresa['nombre']; 
      this.empresa.telefono = datosEmpresa['telefono'];
      this.empresa.paises = datosEmpresa['paises'];
      this.empresa.urlLogo = datosEmpresa['urlLogo'];
      this.empresa.notas = datosEmpresa['notas'];

      this.displayLogo = datosEmpresa['urlLogo'];
      this.archivoLogo = datosEmpresa['urlLogo']
    }
  }

  async borrarImagenActual() {
    if (this.empresa.urlLogo !== "") {
      const result = await this.empresasService.borrarArchivo(this.empresa.urlLogo);
    }
  }

  editarEmpresa() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      if (this.archivoNuevo) {
        this.borrarImagenActual().then(_ => {
          this.empresasService.subirArchivo(this.archivoNuevo).then(respuesta => {
          this.empresa.urlLogo = respuesta;
          this.editarEmpresaFB();
        });
        })
      } else {
        this.editarEmpresaFB();
      }
    }
  }

  editarEmpresaFB() {

    this.empresa.nombre = this.formulario.controls["nombre"].value;
    this.empresa.correo = this.formulario.controls["correo"].value;
    this.empresa.telefono = this.formulario.controls["telefono"].value;
    this.empresa.paises = this.formulario.controls["paises"].value;
    this.empresa.notas = this.formulario.controls["notas"].value;

    this.empresasService.editarEmpresa(this.empresa).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Empresa editada con éxito", undefined);
      this.router.navigate(["/empresas"]);
    });
  }

  mostrarImagen($event:any) {
    if ($event.target.files) {
      this.archivoLogo = $event.target.files[0];
      this.archivoNuevo = $event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.archivoLogo);
      reader.onload = (e:any) => {
        this.displayLogo = e.target.result;
      }
    }
  }
}
