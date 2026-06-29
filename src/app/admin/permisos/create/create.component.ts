import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getDownloadURL } from '@firebase/storage';
import { ESTADOS_PERMISO, TIPOS_PERMISO } from 'src/app/core/services/constantes';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { PermisosService } from 'src/app/core/services/permisos.service';
import { fechaMinima } from 'src/app/core/validators/fecha-minima';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-admin-permisos-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class AdminPermisosCreateComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  archivo: any = null;
  permiso: any = {
    nombre: "",
    tipo: "",
    fechaVencimiento: "",
    urlArchivo: null,
    estado: ""
  }
  cargandoArchivo = false;
  progresoArchivo = 0;
  fechaMinima: string = '';
  tipos: any[] = TIPOS_PERMISO;
  estados: any[] = ESTADOS_PERMISO;
  correos: any[] = [];
  empresas: any[] = [];

  constructor(
    private titleService: Title,
    public fb: FormBuilder,
    private permisosService: PermisosService,
    private empresasService: EmpresasService,
    private mensajesService: MensajesService,
    private router: Router
  ) {
    this.definirFormulario();
  }

  definirFormulario() {
    this.formulario = this.fb.group({
      nombre: ["", [Validators.required]],
      tipo: ["", [Validators.required, seleccionVacia()]],
      fechaVencimiento: ["", [Validators.required, fechaMinima()]],
      urlArchivo: ["", []],
      estado: ["", []],
      empresaId: ["", [Validators.required, seleccionVacia()]],
      nuevoCorreo: ["", [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Permisos");
    this.empresasService.obtenerEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  cargarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  errorEnControlador(controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) &&
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  crearPermiso() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      this.permiso.empresaId = this.formulario.controls["empresaId"].value;
      this.permiso.nombre = this.formulario.controls["nombre"].value;
      this.permiso.tipo = this.formulario.controls["tipo"].value;
      this.permiso.fechaVencimiento = this.formulario.controls["fechaVencimiento"].value;
      this.permiso.estado = this.formulario.controls["estado"].value;
      this.permiso.correos = this.correos.map(correo => ({ ...correo, value: correo.value.trim() })).filter(correo => correo.value !== "");

      if (this.archivo) {
        this.progresoArchivo = 0;
        this.cargandoArchivo = true;
        const tareaSubirArchivo = this.permisosService.subirArchivoAlt(this.archivo);
        tareaSubirArchivo.on('state_changed',
          (snapshot) => {
            this.progresoArchivo = snapshot.totalBytes > 0
              ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              : 0;
          }, (error) => {
            this.cargandoArchivo = false;
            this.mensajesService.mostrarMensaje("error", "El archivo no pudo ser subido", undefined);
            console.log(error);
          }, () => {
            getDownloadURL(tareaSubirArchivo.snapshot.ref).then((downloadURL) => {
              this.cargandoArchivo = false;
              this.mensajesService.mostrarMensaje("success", "Archivo subido con éxito", undefined);
              this.permiso.urlArchivo = downloadURL;
              this.crearPermisoFB();
            });
          });
      } else {
        this.crearPermisoFB();
      }

    } else {
      this.scrollCampoRequeridoInvalido();
    }
  }

  crearPermisoFB() {
    this.permisosService.crearPermiso(this.permiso).then(_ => {
      this.mensajesService.mostrarMensaje("success", "Permiso creado con éxito", undefined);
      this.router.navigate(["/admin/permisos"]);
    }).catch(error => {
      console.log(error);
    });
  }

  private scrollCampoRequeridoInvalido() {
    const camposRequeridosEnOrden = [
      { control: 'empresaId', elementoId: 'fieldEmpresa' },
      { control: 'nombre', elementoId: 'fieldNombre' },
      { control: 'tipo', elementoId: 'fieldTipo' },
      { control: 'fechaVencimiento', elementoId: 'fieldFecha' }
    ];

    const primerCampoInvalido = [...camposRequeridosEnOrden]
      .find(({ control }) => this.formulario.controls[control]?.invalid);

    if (!primerCampoInvalido) {
      return;
    }

    const elemento = document.getElementById(primerCampoInvalido.elementoId);
    elemento?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const input = elemento?.querySelector('input, select, textarea') as HTMLElement;
    input?.focus();
  }

  agregarCorreo() {
    const correoControl = this.formulario.controls["nuevoCorreo"];
    const correoValue = correoControl.value;
    if (correoValue === "" || !correoControl.valid) return;

    this.formulario.controls["nuevoCorreo"].setValue("");
    this.correos.push({ id: this.generarId(), value: correoValue });
  }

  agregarCorreoConEnter(event: any) {
    if (event.key === "Enter") {
      this.agregarCorreo();
    }
  }

  eliminarCorreo(index: number) {
    this.correos.splice(index, 1);
  }

  trackByIndex(index: number) {
    return index;
  }

  generarId(): string {
    return crypto.randomUUID();
  }
}
