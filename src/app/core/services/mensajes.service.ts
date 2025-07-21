import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class MensajesService {
    constructor ( private toastr: ToastrService) {}

    mostrarMensaje (tipo: "success" | "info" | "warning" | "error" , mensaje: string, titulo: string | undefined, config?: any | undefined) {
        const configuracion = config ? config : {
          closeButton: true,
          timeOut: 4000,
          progressBar: true
        };
        this.toastr.clear();
        this.toastr[tipo](mensaje, titulo, configuracion);
    }
}