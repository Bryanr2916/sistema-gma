import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fechaMinima(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');

        const fechaMinima = `${anio}-${mes}-${dia}`;

        return (control.value < fechaMinima &&  control.value !== "") ? { minDate: true} : null;
    }
};
