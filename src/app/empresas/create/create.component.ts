import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});

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

  constructor(
    private titleService: Title, private empresasService: EmpresasService,
    private paisesService: PaisesService,
    private toastr: ToastrService, private router: Router, public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
  }

  definirFormulario() {
    this.formulario = this.fb.group({
      nombre: ["", [Validators.required]],
      correo: ["", [Validators.required, Validators.email]],
      telefono: ["", [Validators.required]],
      pais: ["", [Validators.required, seleccionVacia()]],
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

  crearEmpresa() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      if (this.archivoLogo) {
        this.empresasService.subirArchivo(this.archivoLogo).then( respuesta => {
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

    this.empresa.nombre = this.formulario.controls["nombre"].value;
    this.empresa.correo = this.formulario.controls["correo"].value;
    this.empresa.telefono = this.formulario.controls["telefono"].value;
    this.empresa.pais = this.formulario.controls["pais"].value;
    this.empresa.notas = this.formulario.controls["notas"].value;

    this.empresasService.crearEmpresa(this.empresa).then(_ => {
      this.toastr.success("Empresa creada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(["/empresas"]);
    });
  };

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
