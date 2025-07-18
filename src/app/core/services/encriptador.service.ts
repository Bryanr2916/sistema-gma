import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncriptadorService {

  llaveSecreta = environment.secrectKey;

  constructor() { }

  encriptarContrasena (contrasena: string) {
    const textEncoder = new TextEncoder();
    const contrasenaEncriptada = textEncoder.encode(contrasena);

    const llaveTextEncoder = new TextEncoder();
    const llaveEncriptada = llaveTextEncoder.encode(this.llaveSecreta);

    const contrasenaBytes = Array.from(contrasenaEncriptada);
    const llaveBytes = Array.from(llaveEncriptada);

    return btoa(String.fromCharCode.apply(null, contrasenaBytes.map((byte, index) => byte ^ llaveBytes[index % llaveBytes.length])));
  }

  desencriptarContrasena (contrasenaEncriptada: string) {
    let  contrasenaDecifrada = undefined;
    
    try {
      contrasenaDecifrada = Uint8Array.from(atob(contrasenaEncriptada), c => c.charCodeAt(0));
    } catch (error) {
    }
    
    if (contrasenaDecifrada === undefined) {
      return "";
    }
    const textEncoderLlave = new TextEncoder();
    const llaveCifrada = textEncoderLlave.encode(this.llaveSecreta);

    const contrasenaBytes = Array.from(contrasenaDecifrada);
    const llaveBytes = Array.from(llaveCifrada);
    
    return String.fromCharCode.apply(null, contrasenaBytes.map((byte, index) => byte ^ llaveBytes[index % llaveBytes.length]));
  }
}
