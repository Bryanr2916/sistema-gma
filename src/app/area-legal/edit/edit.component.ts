import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  areaLegal = { nombre:"", id: "" };

  constructor(
    private titleService: Title,
    private areaService: AreaLegalService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
    this.route.params.subscribe( params => {
      this.areaLegal.id = params["id"];
    });
    this.areaService.obtenerArea(this.areaLegal.id).then( respuesta => {
      this.areaLegal.nombre = respuesta.get("nombre");
    });
  }

  editarArea() {
    if(this.formularioEsValido()) {
      this.areaService.editarArea(
        this.areaLegal
      ).then(data => {
        console.log(data);
        this.toastr.success("Área editada con éxito", undefined, {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        });
        this.router.navigate(["/area-legal"]);
      }).catch(error => {
        console.log(error);
      });
    }
  }

  formularioEsValido() {
    return this.areaLegal.nombre !== "";
  }

}
