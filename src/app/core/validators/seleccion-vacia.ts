import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function seleccionVacia(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        console.log("control.value: ", control.value);
        return (
            control.value === 0
            || control.value === "select-valor-vacio"
            || (control.value[0] === "select-valor-vacio" && control.value.length === 1 )) ? { emptySelect: true} : null;
    }
};
