import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function compararContrasenas(contrasena: string, repContrasena: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const contrasenaField = formGroup.get(contrasena)?.value;
        const repContrasenaField = formGroup.get(repContrasena)?.value;

        if (contrasenaField !== repContrasenaField) {
            formGroup.get(repContrasena)?.setErrors({ contrasenaNoCoincide: true });
        } else {
            const errors = formGroup.get(repContrasena)?.errors;
            if (errors) {
                delete errors['contrasenaNoCoincide'];
                if (Object.keys(errors).length === 0) {
                    formGroup.get(repContrasena)?.setErrors(null);
                }
            }
        }
        
        return null;
    }
};