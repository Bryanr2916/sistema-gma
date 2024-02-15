import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  tipoNormativas = { nombre:"", id: "" };

  constructor(
    private titleService: Title,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
    this.route.params.subscribe( params => {
      this.tipoNormativas.id = params["id"];
    });
    this.tiposService.obtenerTipo(this.tipoNormativas.id).then( respuesta => {
      // id no existente
      if (! respuesta.data()) {
        this.toastr.info("El tipo de normativa no existe en el sistema", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/tipos-normativas"]);
      }
      console.log(respuesta.data());
      this.tipoNormativas.nombre = respuesta.get("nombre");
    });
  }

  editarTipo() {
    if(this.formularioEsValido()) {
      this.tiposService.editarTipo(
        this.tipoNormativas
      ).then(data => {
        console.log(data);
        this.toastr.success("Tipo de normativas editado con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/tipos-normativas"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  formularioEsValido() {
    return this.tipoNormativas.nombre !== "";
  }

}
