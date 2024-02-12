import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  
  tipoNormativas = { nombre:"" };

  constructor(
    private titleService: Title,
    private tiposService: TiposNormativasService,
    private toastr: ToastrService,
    private router: Router ) { }


  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
  }

  crearTipo() {
    if(this.formularioEsValido()) {
      this.tiposService.crearTipo(
        this.tipoNormativas
      ).then(() => {
        this.toastr.success("Tipo de normativas creada con éxito", undefined, {
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
