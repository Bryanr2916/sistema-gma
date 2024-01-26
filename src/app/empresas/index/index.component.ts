import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  acciones= ["Usar como |", "Editar |", "Borrar |", "Duplicar"]
  ths = ["#","Empresa", "Administrador", "Correo Electrónico", "Acciones"];
  trs = [
    { nombre: "empresa 1", admin: "admin 1", correo: "correo1@empresa.com"},
    { nombre: "empresa 2", admin: "admin 2", correo: "correo2@empresa.com"},
    { nombre: "empresa 3", admin: "admin 3", correo: "correo3@empresa.com"},
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
  }

}
