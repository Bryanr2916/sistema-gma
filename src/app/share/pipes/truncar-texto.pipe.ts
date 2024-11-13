import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncarTexto'
})
export class TruncarTextoPipe implements PipeTransform {

  transform(valor: string, limite: number, elipise: boolean): string {
    if (!valor) return "";

    if (valor.length <= limite) return valor;
    
    return elipise ? `${valor.slice(0, limite)} ...` : valor.slice(0, limite);
  }

}
