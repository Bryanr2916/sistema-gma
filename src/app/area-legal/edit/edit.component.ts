import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';
import { MensajesService } from 'src/app/core/services/mensajes.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  formulario: FormGroup = this.fb.group({});
  areaLegal = { nombre:"", id: "" };

  constructor(
    private titleService: Title,
    private areaService: AreaLegalService,
    private mensajesService: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.definirFormulario(); 
  }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
    this.route.params.subscribe( params => {
      this.areaLegal.id = params["id"];
    });
    this.areaService.obtenerArea(this.areaLegal.id).then( respuesta => {
      this.formulario.controls["nombre"].setValue(respuesta.get("nombre"));
    });
  }

  definirFormulario() {
        this.formulario = this.fb.group({
          nombre: ["", [Validators.required]]
        });
      }
    
  errorEnControlador (controlador: string, error: string) {
    return (
      this.formulario.controls[controlador].hasError(error) && 
      this.formulario.controls[controlador].invalid &&
      (this.formulario.controls[controlador].touched)
    );
  }

  editarArea() {
    this.formulario.markAllAsTouched();
    if(this.formulario.valid) {

      this.areaLegal.nombre = this.formulario.controls["nombre"].value;

      this.areaService.editarArea(
        this.areaLegal
      ).then(_ => {
        this.mensajesService.mostrarMensaje("success", "Área editada con éxito", undefined);
        this.router.navigate(["/area-legal"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
