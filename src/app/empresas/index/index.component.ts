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
  acciones= ["Usar como |", "Editar |", "Borrar |", "Duplicar"]
  ths = ["#","Empresa", "Administrador", "Correo Electrónico", "Acciones"];
  empresasTodas:any[] = [];
  empresasFiltradas:any[] = [];
  trs = [
    { nombre: "empresa 1", admin: "admin 1", correo: "correo1@empresa.com"},
    { nombre: "empresa 2", admin: "admin 2", correo: "correo2@empresa.com"},
    { nombre: "empresa 3", admin: "admin 3", correo: "correo3@empresa.com"},
  ];

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("GMA Sistema - Empresas");
    this.empresasTodas = [
      { nombre: "Equifax", admin: "admin 1", correo: "correo1@empresa.com"},
      { nombre: "Toys", admin: "admin 2", correo: "correo2@empresa.com"},
      { nombre: "Dos Pinos", admin: "admin 3", correo: "correo3@empresa.com"},
    ];
    this.empresasFiltradas = this.empresasTodas;
    this.cargando = false;
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.empresasFiltradas = this.empresasTodas.filter(empresa => 
      empresa.nombre.toLowerCase().includes(busquedaMinuscuala));
  }

}
