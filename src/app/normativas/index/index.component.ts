import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  cargando = true;
  busqueda = "";
  acciones= ["Editar |", "Borrar"]
  ths = ["Número","Título","Tipo de Normativa", "Acciones"];
  normativasTodas:any[] = [];
  normativasFiltradas:any[] = [];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
    this.normativasTodas = [
    { numero: 675, titulo: "normativa uno", tipo: "Reglamentos"},
    { numero: 901, titulo: "normativa dos", tipo: "Resolución Ministerial"},
    { numero: 12105, titulo: "normativa tres", tipo: "Reglamentos"},
    { numero: 873, titulo: "normativa cuatro", tipo: "Reglamentos"},
    { numero: 4100, titulo: "normativa cinco", tipo: "Leyes"},
    { numero: 321, titulo: "normativa seis", tipo: "Resolución Ministerial"}
  ];
    this.normativasFiltradas = this.normativasTodas;
    this.cargando = false;
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.normativasFiltradas = this.normativasTodas.filter(normativa => 
      normativa.titulo.toLowerCase().includes(busquedaMinuscuala) ||
      String(normativa.numero).includes(busquedaMinuscuala));
  }

}
