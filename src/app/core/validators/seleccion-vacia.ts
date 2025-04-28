import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function seleccionVacia(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valoresVacios = ["Seleccione el tipo", "Seleccione el país"];
        const esVacio = valoresVacios.includes(control.value);
        return esVacio ? { emptySelect: true} : null;
    }
};
