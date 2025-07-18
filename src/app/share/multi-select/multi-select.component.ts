import { Component, ElementRef, HostListener, Input,OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

  @Input() opciones: any;
  @Input() controlName: any;
  @Input() formulario!: FormGroup;

  seleccionActual: any[] = [];
  abrirSelect = false;
  opcionesFiltradas = [];
  busqueda = "";

  constructor(private elementRef: ElementRef) {
    this.formulario?.controls["paises"].setValue("HEY THERE");
  }
  
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.abrirSelect = false;
    }
  }

  ngOnInit(): void {
    this.opcionesFiltradas = this.opciones;
    this.formulario?.controls["paises"].setErrors({ emptySelect: true});
  }

  seleccionar(indice: any) {
    const opcionSeleccionada = this.opcionesFiltradas[indice];

    const indiceSeleccion = this.seleccionActual.findIndex(s => s === opcionSeleccionada);

    if (indiceSeleccion !== -1) {
      // borrar seleccion
      this.seleccionActual.splice(indiceSeleccion, 1);
    } else {
      // agregar seleccion
      this.seleccionActual.push(opcionSeleccionada);
    }
    this.formulario?.controls["paises"].setValue(this.seleccionActual);
  }

  removerSeleccion($event: Event, indice: number) {
    $event.stopPropagation();
    this.seleccionActual.splice(indice, 1);
    this.formulario?.controls["paises"].setValue(this.seleccionActual);
  }

  toggle($event: Event) {
    if (!($event.target instanceof HTMLInputElement)) {
      this.abrirSelect = !this.abrirSelect;
    } else if (!this.abrirSelect) {
      this.abrirSelect = !this.abrirSelect;
    }
  }

  esSeleccionada(opcion: string) {
    return this.seleccionActual.includes(opcion);
  }

  buscar(event: any) {
    const busquedaMinuscuala = event.toLowerCase();
    this.opcionesFiltradas = this.opciones.filter((opcion: any) => 
      opcion.toLowerCase().includes(busquedaMinuscuala));
  }

  trackByOpcion(index: number, opcion: string) {
    return opcion;
  }
}
