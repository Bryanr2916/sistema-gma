import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from 'src/app/core/services/empresas.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { compararContrasenas } from 'src/app/core/validators/comparar-contrasenas';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})
export class UsuariosEditComponent implements OnInit {
  cargando = true;
  empresa: any = {};
  formulario: FormGroup = this.fb.group({});
  tipos: any = [];
  usuario: any = {
    id: "",
    nombre: "",
    correo: "",
    tipo: 0,
    uid: "",
    empresaId: ""
  };

  constructor(
    private titleService: Title,
    public fb: FormBuilder,
    private usuarioService: UsuarioService,
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
    private empresasService: EmpresasService
  ) {
    this.tipos = usuarioService.tiposSelect();
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresa.id = params["id"];
      this.usuario.id = params["idUsuario"];
      this.obtenerUsuario();
    });
  }

  async cargarEmpresa() {
    const empresaFB = await this.empresasService.obtenerEmpresa(this.usuario.empresaId);
    if (empresaFB.exists()) {
      this.empresa = { ...this.empresa, ...empresaFB.data() };
      this.cargando = false;
    }
  }

  async obtenerUsuario() {
    const reUsuario = await this.usuarioService.obtenerUsuario(this.usuario.id);
    this.usuario = ({...reUsuario.data(), id: reUsuario.id});
    delete this.usuario.contrasena;
    this.formulario.controls["nombre"].setValue(reUsuario.get("nombre"));
    this.formulario.controls["correo"].setValue(reUsuario.get("correo"));
    this.formulario.controls["tipo"].setValue(reUsuario.get("tipo"));

    this.formulario.controls["correo"].disable();

    this.cargarEmpresa();
  }

  definirFormulario() {
      this.formulario = this.fb.group({
        nombre: ["", [Validators.required]],
        correo: ["", [Validators.required, Validators.email]],
        tipo: [0, [Validators.required, seleccionVacia()]],
      },
      {
        validators: compararContrasenas("contrasena", "repContrasena")
      }
    );
    }
  
    errorEnControlador (controlador: string, error: string) {
      return (
        this.formulario.controls[controlador].hasError(error) && 
        this.formulario.controls[controlador].invalid &&
        (this.formulario.controls[controlador].touched)
      );
    }

    editarUsuario() {
      this.formulario.markAllAsTouched();
      if(this.formulario.valid) {
        this.usuario.nombre = this.formulario.controls["nombre"].value;
        this.usuario.correo = this.formulario.controls["correo"].value;
        this.usuario.tipo = Number(this.formulario.controls["tipo"].value);

        this.usuario.empresaId = this.empresa.id;

        this.usuarioService.editarUsuario(this.usuario).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Usuario editado con éxito", undefined);
          this.router.navigate([`/empresas/${this.empresa.id}/usuarios`]);
        });
      } else {
        this.scrollCampoRequeridoInvalido();
      }
    }

    obtenerUrl () {
      return `/empresas/${this.empresa.id}/usuarios`;
    }

  private scrollCampoRequeridoInvalido() {
    const camposRequeridosEnOrden = [
      { control: 'nombre', elementoId: 'fieldNombre' },
      { control: 'correo', elementoId: 'fieldCorreo' },
      { control: 'tipo', elementoId: 'fieldTipo' }
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
}
