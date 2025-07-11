import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  archivo:any = null;
  normativa = {
    id: "",
    titulo: "",
    tipoId: "",
    numero: "",
    fecha: "",
    pais: "",
    modificacion: "",
    entidad: "",
    enlace: "",
    comentarios: "",
    urlArchivo: ""
  }
  tipos:any[] = [];
  paises = this.paisesService.paises;

  constructor(
    private titleService: Title,
    private normativaService: NormativaService,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private paisesService: PaisesService,
    public fb: FormBuilder
  ) {
    this.definirFormulario();
  }

  definirFormulario() {
      this.formulario = this.fb.group({
        titulo: ["", [Validators.required]],
        tipoId: ["", [Validators.required, seleccionVacia()]],
        numero: ["", [Validators.required]],
        fecha: ["", [Validators.required]],
        pais: ["", [Validators.required, seleccionVacia()]],
        modificacion: ["", []],
        entidad: ["", []],
        enlace: ["", []],
        comentarios: ["", []],
        urlArchivo: ["", []],
      });
    }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.route.params.subscribe( params => {
      this.normativa.id = params["id"];
    });

    this.normativaService.obtenerNormativa(this.normativa.id).then( respuesta => {
      this.formulario.controls["titulo"].setValue(respuesta.get("titulo"));
      this.formulario.controls["tipoId"].setValue(respuesta.get("tipoId"));
      this.formulario.controls["numero"].setValue(respuesta.get("numero"));
      this.formulario.controls["fecha"].setValue(respuesta.get("fecha"));
      this.formulario.controls["pais"].setValue(respuesta.get("pais"));
      this.formulario.controls["modificacion"].setValue(respuesta.get("modificacion"));
      this.formulario.controls["entidad"].setValue(respuesta.get("entidad"));
      this.formulario.controls["enlace"].setValue(respuesta.get("enlace"));
      this.formulario.controls["comentarios"].setValue(respuesta.get("comentarios"));
      this.formulario.controls["urlArchivo"].setValue(respuesta.get("urlArchivo"));
      

      this.normativa.titulo = respuesta.get("titulo");
      this.normativa.tipoId = respuesta.get("tipoId");
      this.normativa.numero = respuesta.get("numero");
      this.normativa.fecha = respuesta.get("fecha");
      this.normativa.pais = respuesta.get("pais");
      this.normativa.modificacion = respuesta.get("modificacion");
      this.normativa.entidad = respuesta.get("entidad");
      this.normativa.enlace = respuesta.get("enlace");
      this.normativa.comentarios = respuesta.get("comentarios");
      this.normativa.urlArchivo = respuesta.get("urlArchivo");
      this.tiposService.obtenerTipos().subscribe(datos => {
        this.tipos = datos;
      });
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  async borrarArchivonActual() {
    if (this.normativa.urlArchivo !== "") {
      await this.normativaService.borrarArchivo(this.normativa.urlArchivo);
    }
  }
  
  editarNormativa() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {

      this.normativa.titulo = this.formulario.controls["titulo"].value;
      this.normativa.tipoId = this.formulario.controls["tipoId"].value;
      this.normativa.numero = this.formulario.controls["numero"].value;
      this.normativa.fecha = this.formulario.controls["fecha"].value;
      this.normativa.pais = this.formulario.controls["pais"].value;
      this.normativa.modificacion = this.formulario.controls["modificacion"].value;
      this.normativa.entidad = this.formulario.controls["entidad"].value;
      this.normativa.enlace = this.formulario.controls["enlace"].value;
      this.normativa.comentarios = this.formulario.controls["comentarios"].value;

      if (this.archivo) {
        this.borrarArchivonActual().then(_ => {
        });
      } else {
        this.editarNormativaFB();
      }
    }
  }

  editarNormativaFB() {
    this.normativaService.editarNormativa(this.normativa).then(_ => {
      this.toastr.success("Normativa editada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
      this.router.navigate(["/normativas"]);        
    }).catch(error => {
      console.log(error);
    });
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }
}
