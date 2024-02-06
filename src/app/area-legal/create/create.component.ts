import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AreaLegalService } from 'src/app/core/services/area-legal.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  areaLegal = { nombre:"" };

  constructor(
    private titleService: Title,
    private areaService: AreaLegalService,
    private toastr: ToastrService,
    private router: Router ) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Área legal");
  }

  crearArea() {
    if(this.formularioEsValido()) {
      this.areaService.crearArea(
        this.areaLegal
      ).then(data => {

        console.log(data);
        this.toastr.success("Área creada con éxito", undefined, {
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
