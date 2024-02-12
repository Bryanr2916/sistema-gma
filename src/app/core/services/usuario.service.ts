import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private auth: Auth) { }

  registrar(usuario: any) {
    return createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  iniciarSesion(usuario: any) {
    return signInWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  cerrarSesion() {
    return signOut(this.auth);
  }
}
