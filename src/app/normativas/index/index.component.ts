import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  acciones= ["Editar |", "Borrar"]
  ths = ["Número","Título","Tipo de Normativa", "Acciones"];
  trs = [
    { numero: 321, titulo: "loremadfad adfasdf asdfasd", tipo: "Resolución Ministerial"},
    { numero: 675, titulo: "ljaldfjal aldsjlasdjfajds flajfaldskjf", tipo: "Reglamentos"},
    { numero: 901, titulo: "este es ", tipo: "Resolución Ministerial"},
    { numero: 12105, titulo: "adfadsfasf", tipo: "Reglamentos"},
    { numero: 873, titulo: "zczva", tipo: "Reglamentos"},
    { numero: 4100, titulo: "Normas adsfa", tipo: "Leyes"},
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Normativas");
  }

}
