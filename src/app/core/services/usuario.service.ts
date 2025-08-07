import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import { EncriptadorService } from './encriptador.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  path = "usuarios";

  // todo: usar usuarioCache para optimizar llamados a la db
  private usuarioCache$ = new BehaviorSubject<any | null>(null); // Cache user data

  constructor(private auth: Auth, private firestore: Firestore, private encriptador: EncriptadorService) { }

  registrar(usuario: any) {
    return createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  iniciarSesion(usuario: any) {
    return signInWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
  }

  cerrarSesion() {
    this.usuarioCache$.next(null);
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

  obtenerUsuarioPorCorreo(correo: string) {
    const usuarioRef = collection(this.firestore, this.path);
    
    const usuarioCorreo = query(usuarioRef, where("correo", "==", correo));
    return getDocs(usuarioCorreo);
  }

  obtenerUsuarioPorEmpresa(empresaId: string) {
    const usuarioRef = collection(this.firestore, this.path);

    if (empresaId) {
      const usuariosEmpresa = query(usuarioRef, where("empresaId", "==", empresaId));
      return getDocs(usuariosEmpresa);
    } else {
      const usuariosEmpresa = query(usuarioRef);
      return getDocs(usuariosEmpresa);
    }
  }

  editarUsuario(usuario: any) {
    console.log("editarUsuario: ", usuario);
    const usuarioref = doc(this.firestore, `${this.path}/${usuario.id}`);
    return updateDoc(usuarioref, usuario);
  }

  reestablecerContrasena(correo: string) {
    return sendPasswordResetEmail(this.auth, correo);
  }

  borrarUsuario(id: any) {
    const usuarioRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(usuarioRef);
  }
}
