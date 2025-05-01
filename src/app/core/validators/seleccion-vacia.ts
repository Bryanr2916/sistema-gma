import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function seleccionVacia(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return control.value === "select-valor-vacio" ? { emptySelect: true} : null;
    }
};
