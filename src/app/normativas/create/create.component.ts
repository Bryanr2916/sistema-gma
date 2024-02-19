import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NormativaService } from 'src/app/core/services/normativa.service';
import { PaisesService } from 'src/app/core/services/paises.service';
import { TiposNormativasService } from 'src/app/core/services/tipos-normativas.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  archivo:any = null;
  normativa = {
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

  constructor(private titleService: Title, private paisesService: PaisesService,
    private tiposService:TiposNormativasService, private normativaService:NormativaService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.tiposService.obtenerTipos().subscribe(datos => {
      this.tipos = datos;
    });
  }

  crearNormativa() {
    if (this.formularioEsValido()) {

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
      this.toastr.success("Normativa creada con éxito", undefined, {
        closeButton: true,
        timeOut: 4000,
        progressBar: true
      });
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

    return "";
  }

}
