import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss']
})
export class DropdownSearchComponent implements OnInit {

  @Input() opciones: any[] = [];
  @Input() controlName: string = '';
  @Input() formulario!: FormGroup;
  @Input() labelField: string = 'label';
  @Input() valueField: string = 'id';
  @Input() searchFields: string[] = [];
  @Input() placeholder: string = 'Buscar...';
  @Input() labelSeleccionVacia: string = 'Seleccione una opción';

  seleccion: any = null;
  abrirDropdown = false;
  opcionesFiltradas: any[] = [];
  busqueda = '';

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.abrirDropdown = false;
    }
  }

  ngOnInit(): void {
    this.opcionesFiltradas = [...this.opciones];
    const control = this.formulario?.controls[this.controlName];
    control?.valueChanges.subscribe(value => {
      if (value === '' || value === null || value === undefined) {
        this.seleccion = null;
      }
    });
  }

  toggle(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) {
      this.abrirDropdown = !this.abrirDropdown;
      if (this.abrirDropdown) {
        this.busqueda = '';
        this.opcionesFiltradas = [...this.opciones];
      }
    }
  }

  seleccionar(opcion: any) {
    this.seleccion = opcion;
    this.formulario?.controls[this.controlName].setValue(opcion[this.valueField]);
    this.abrirDropdown = false;
    this.busqueda = '';
    this.opcionesFiltradas = [...this.opciones];
  }

  buscar(event: any) {
    const busquedaMinuscula = (event || '').toLowerCase();
    if (!busquedaMinuscula) {
      this.opcionesFiltradas = [...this.opciones];
      return;
    }
    this.opcionesFiltradas = this.opciones.filter((opcion: any) =>
      this.searchFields.some(field =>
        (opcion[field] || '').toString().toLowerCase().includes(busquedaMinuscula)
      )
    );
  }

  getLabel(opcion: any): string {
    return opcion[this.labelField] || '';
  }

  esSeleccionada(opcion: any): boolean {
    return this.seleccion && this.seleccion[this.valueField] === opcion[this.valueField];
  }
}
