import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
  empresaId = "";
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

  constructor(private titleService: Title, public fb: FormBuilder, private usuarioService: UsuarioService,
      private mensajesService: MensajesService, private router: Router, private route: ActivatedRoute) {
    this.tipos = usuarioService.tiposSelect();
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe(params => {
      this.usuario.id = params["id"];
      this.obtenerUsuario();
    });
  }

  async obtenerUsuario() {
    const reUsuario = await this.usuarioService.obtenerUsuario(this.usuario.id);
    this.usuario = ({ ...reUsuario.data(), id: reUsuario.id });
    delete this.usuario.contrasena;
    this.formulario.controls["nombre"].setValue(reUsuario.get("nombre"));
    this.formulario.controls["correo"].setValue(reUsuario.get("correo"));
    this.formulario.controls["tipo"].setValue(reUsuario.get("tipo"));

    this.formulario.controls["correo"].disable(); 
  }

  definirFormulario() {
    this.formulario = this.fb.group(
      {
        nombre: ["", [Validators.required]],
        correo: ["", [Validators.required, Validators.email]],
        tipo: [0, [Validators.required, seleccionVacia()]],
      }
    );
  }

  errorEnControlador(controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) &&
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  editarUsuario() {
    this.formulario.markAllAsTouched();
    if (this.formulario.valid) {
      this.usuario.nombre = this.formulario.controls["nombre"].value;
      this.usuario.correo = this.formulario.controls["correo"].value;
      this.usuario.tipo = Number(this.formulario.controls["tipo"].value);

      this.usuarioService.editarUsuario(this.usuario).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Usuario editado con éxito", undefined);
        this.router.navigate(["/empresa/gestionar-usuarios"]);
      });
    }
  }
}
