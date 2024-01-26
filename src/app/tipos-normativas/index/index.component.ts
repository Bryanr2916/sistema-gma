import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  acciones= ["Editar |", "Borrar"]
  ths = ["#","Tipos de Normativas", "Acciones"];
  trs = [
    { nombre: "Acuerdo"},
    { nombre: "Codex"},
    { nombre: "Decretos"},
    { nombre: "Directriz"},
    { nombre: "Leyes"},
    { nombre: "Normas INTE"},
    { nombre: "Orden de Inicio"},
    { nombre: "Permisos"},
    { nombre: "Reglamentos"},
    { nombre: "Resoluciones"},
    { nombre: "Resolución Ministerial"},
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Tipos de normativas");
  }

}
