import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Combobox con buscador interno.
 *
 * Soporta dos modos:
 *  - Formularios (existente): se pasa `[formulario]` + `[controlName]` y el valor
 *    se escribe/lee en el FormGroup.
 *  - Filtro de listado: NO se pasa `[formulario]`; se controla con `[valor]` +
 *    `(valorChange)` (usar `labelSeleccionVacia="Todos"` para el estado por defecto).
 */
@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss']
})
export class DropdownSearchComponent implements OnInit, OnChanges {

  @Input() opciones: any[] = [];
  @Input() controlName: string = '';
  /** Modo formulario: opcional. Si no se pasa, el componente opera en modo filtro. */
  @Input() formulario?: FormGroup;
  @Input() labelField: string = 'label';
  @Input() valueField: string = 'id';
  @Input() searchFields: string[] = [];
  @Input() placeholder: string = 'Buscar...';
  @Input() labelSeleccionVacia: string = 'Seleccione una opción';
  /** Modo filtro: valor actual (null/undefined = "Todos"). */
  @Input() valor: any = null;
  /** Modo filtro: emite el valor seleccionado (o null al limpiar). */
  @Output() valorChange = new EventEmitter<any>();

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
    if (control) {
      control.valueChanges.subscribe(value => {
        if (value === '' || value === null || value === undefined) {
          this.seleccion = null;
        } else {
          this.sincronizarSeleccion(value);
        }
      });
      this.sincronizarSeleccion(control.value);
    } else {
      // Modo filtro: el valor lo controla el padre a través de [valor].
      this.sincronizarSeleccion(this.valor);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opciones'] && this.opciones) {
      this.opcionesFiltradas = [...this.opciones];
      const control = this.formulario?.controls[this.controlName];
      if (control?.value) {
        this.sincronizarSeleccion(control.value);
      } else if (!control) {
        // Modo filtro: re-sincroniza con el valor controlado por el padre.
        this.sincronizarSeleccion(this.valor);
      }
    }
    if (changes['valor'] && !this.formulario) {
      this.sincronizarSeleccion(this.valor);
    }
  }

  private sincronizarSeleccion(value: any): void {
    if (value === '' || value === null || value === undefined) {
      this.seleccion = null;
      return;
    }
    const opcion = this.opciones.find(opt => opt[this.valueField] === value);
    this.seleccion = opcion || null;
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
    if (this.formulario) {
      this.seleccion = opcion;
      this.formulario.controls[this.controlName].setValue(opcion[this.valueField]);
    } else {
      // Modo filtro: volver a pulsar la opción seleccionada la deselecciona ("Todos").
      const esActual = this.seleccion && this.seleccion[this.valueField] === opcion[this.valueField];
      this.seleccion = esActual ? null : opcion;
      this.valorChange.emit(this.seleccion ? opcion[this.valueField] : null);
    }
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
