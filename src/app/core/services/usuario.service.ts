import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import { EncriptadorService } from './encriptador.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  path = "usuarios";

  constructor(private auth: Auth, private firestore: Firestore, private encriptador: EncriptadorService) { }

  registrar(usuario: any) {
    return createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  iniciarSesion(usuario: any) {
    return signInWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  cerrarSesion() {
    return signOut(this.auth);
  }

  usuarioActual() {
    return user(this.auth);
  }

  usuarioActualFS(uid: string) {
    const usuarioRef = collection(this.firestore, this.path);
    
    const usuarioUID = query(usuarioRef, where("uid", "==", uid));
    return getDocs(usuarioUID);
  }

  crearUsuario( usuario:any ) {
    const usuarioRef = collection(this.firestore, this.path);
    return addDoc(usuarioRef,
      {
        correo: usuario.correo,
        nombre: usuario.nombre,
        uid: usuario.uid,
        tipo: usuario.tipo,
        empresaId: usuario.empresaId,
        contrasena: this.encriptador.encriptarContrasena(usuario.contrasena)
      }
    );
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.firestore, this.path);
    return collectionData(usuariosRef, {idField: 'id'}) as Observable<any[]>;
  }
}
