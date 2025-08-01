import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MensajesService } from 'src/app/core/services/mensajes.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { compararContrasenas } from 'src/app/core/validators/comparar-contrasenas';
import { seleccionVacia } from 'src/app/core/validators/seleccion-vacia';

@Component({
  selector: 'app-usuarios-create',
  templateUrl: './usuarios-create.component.html',
  styleUrls: ['./usuarios-create.component.scss']
})
export class UsuariosCreateComponent implements OnInit {
  empresaId = "";
  formulario: FormGroup = this.fb.group({});
  tipos = [
    {
      valor: 2,
      etiqueta: "Administrador"
    },
    {
      valor: 3,
      etiqueta: "Editor"
    },
    {
      valor: 4,
      etiqueta: "Lector"
    }
  ];
  usuario = {
    nombre: "",
    correo: "",
    tipo: 0,
    contrasena: "",
    uid: "",
    empresaId: ""
  };

  constructor(private titleService: Title, public fb: FormBuilder, private usuarioService: UsuarioService,
    private mensajesService: MensajesService, private router: Router, private route: ActivatedRoute
  ) {
    this.definirFormulario();
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.route.params.subscribe( params => {
      this.empresaId = params["id"];
    });
  }

  definirFormulario() {
      this.formulario = this.fb.group({
        nombre: ["", [Validators.required]],
        correo: ["", [Validators.required, Validators.email]],
        contrasena: ["", [Validators.required, Validators.minLength(6)]],
        repContrasena: ["", [Validators.required]],
        tipo: [0, [Validators.required, seleccionVacia()]],
      },
      {
        validators: compararContrasenas("contrasena", "repContrasena")
      }
    );
    }
  
    errorEnControlador (controlador: string, error: string) {
      if (controlador === "contrasena") {
        console.log("contrasena: ", this.formulario.controls[controlador]);
      }
      return (
        this.formulario.controls[controlador].hasError(error) && 
        this.formulario.controls[controlador].invalid &&
        (this.formulario.controls[controlador].touched)
      );
    }

    crearUsuario() {
      this.formulario.markAllAsTouched();
      if(this.formulario.valid) {
        this.usuario.nombre = this.formulario.controls["nombre"].value;
        this.usuario.correo = this.formulario.controls["correo"].value;
        this.usuario.tipo = Number(this.formulario.controls["tipo"].value);
        this.usuario.contrasena = this.formulario.controls["contrasena"].value;
        this.usuario.empresaId = this.empresaId;

        this.usuarioService.crearUsuario(this.usuario).then(_ => {
          this.mensajesService.mostrarMensaje("success", "Usuario creado con éxito", undefined);
          this.router.navigate([`/empresas/${this.empresaId}/usuarios`]);
            });
          }
    }

    obtenerUrl () {
      return `/empresas/${this.empresaId}/usuarios`;
    }

}
