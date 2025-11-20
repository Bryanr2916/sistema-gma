import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  archivo:any = null;
  normativa: any = {
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
  };
  requerimientos:any[] = [];
  tipos:any[] = [];
  paises = this.paisesService.paises;

  constructor(private titleService: Title, private paisesService: PaisesService,
    private tiposService:TiposNormativasService, private normativaService:NormativaService,
    private mensajesService: MensajesService,
    private router: Router, public fb: FormBuilder) {
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
      nuevoReq: ["", []]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe(datos => {
      this.tipos = datos;
    });
  }

  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  crearNormativa() {
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
      this.normativa.requerimientos = this.requerimientos.map(req => ({...req, value: req.value.trim()})).filter(req => req.value !== "");

      if (this.archivo) {
        this.normativaService.subirArchivo(this.archivo).then( respuesta => {
          this.normativa.urlArchivo = respuesta;
          this.crearNormativaFB();
        });
      } else {
        this.crearNormativaFB();
      }
    }
  }

  crearNormativaFB() {
    this.normativaService.crearNormativa(this.normativa).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Normativa creada con éxito", undefined);
      this.router.navigate(["/normativas"]);
    }).catch(error => {
      console.log(error);
    });
  }

  formularioEsValido() {
    return true;
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  agregarReqConEnter(event: any) {
    if (event.key === "Enter") {
      this.agregarRequerimiento();
    }
  }

  agregarRequerimiento() {
    const reqValue = this.formulario.controls["nuevoReq"].value;

    if (reqValue === "") return;

    this.formulario.controls["nuevoReq"].setValue("");
    this.requerimientos.push({id: this.generarId(), value: reqValue});
  }

  eliminarRequerimiento(index: number) {
    this.requerimientos.splice(index, 1);
  }

  // para que el input no pierda el foco
  trackByIndex(index: number) {
    return index;
  }

  // para los reqs
  generarId(): string {
    return crypto.randomUUID();
  }

}
