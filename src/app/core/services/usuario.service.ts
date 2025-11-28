import { Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, query, where, getDocs, serverTimestamp } from '@angular/fire/firestore';
import { EncriptadorService } from './encriptador.service';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  path = "usuarios";

  // todo: usar usuarioCache para optimizar llamados a la db
  private usuarioCache$ = new BehaviorSubject<any | null>(null); // Cache user data

  constructor(private auth: Auth, private firestore: Firestore, private encriptador: EncriptadorService) { }

  // el usuario no existe en auth pero sí ha sido agregado a la base de datos
    async registrar(usuario: any) {
      const promise = await createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
      const { uid } = promise.user;

      const usuarioFS = await this.obtenerUsuarioPorCorreo(promise.user.email || "");
      
      const usuarioActual = {...usuarioFS.docs[0].data(), id: usuarioFS.docs[0].id, uid: uid};
      await this.editarUsuario(usuarioActual);

      return promise;
    }

  async iniciarSesion(usuario: any) {
    const promise = await signInWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena);
    const { uid } = promise.user;

    const usuarioFS = await this.usuarioActualFS(uid);
    const usuarioActual = {...usuarioFS.docs[0].data(), id: usuarioFS.docs[0].id};
    this.usuarioCache$.next({
      authUser: promise.user,
      dbUser: usuarioActual
    });

    return promise;
  }

  cerrarSesion() {
    this.usuarioCache$.next(null);
    return signOut(this.auth);
  }

  usuarioAuthActual() {
    return user(this.auth);
  }

  // todo: borrar usuarioActualFS y utilizar usuarioActualFSS
  usuarioActualFS(uid: string) {
    const usuarioRef = collection(this.firestore, this.path);
    
    const usuarioUID = query(usuarioRef, where("uid", "==", uid));
    return getDocs(usuarioUID);
  }

  usuarioActualFSS(uid: string) {
    const usuarioRef = collection(this.firestore, this.path);
    const usuarioUID = query(usuarioRef, where("uid", "==", uid));
    return collectionData(usuarioUID, { idField: 'id' });
  };

  usuarioActual() {
    const usuarioAuth = user(this.auth);
    return usuarioAuth.pipe(switchMap((user: User | null) => {
      if (user === null) return of(null);
      
      const usuarioRef = collection(this.firestore, this.path);
      const usuarioUID = query(usuarioRef, where("uid", "==", user.uid));

      return collectionData(usuarioUID, { idField: 'id' }).pipe(
        map(users => users[0] ?? null)
      );
    }));
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
        contrasena: this.encriptador.encriptarContrasena(usuario.contrasena),
        fechaCreacion: serverTimestamp()
      }
    );
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.firestore, this.path);
    return collectionData(usuariosRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerUsuario(id: any) {
    const usuarioRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(usuarioRef);
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
    const usuarioref = doc(this.firestore, `${this.path}/${usuario.id}`);
    return updateDoc(usuarioref, {...usuario, fechaEdicion: serverTimestamp()});
  }

  reestablecerContrasena(correo: string) {
    return sendPasswordResetEmail(this.auth, correo);
  }

  borrarUsuario(id: any) {
    const usuarioRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(usuarioRef);
  }

  // tipos de usuario para un select
  tiposSelect() {
    return [
    {
      valor: 2,
      etiqueta: "Administrador"
    },
    {
      valor: 3,
      etiqueta: "Editor"
    },
    {
      valor: 4,
      etiqueta: "Lector"
    }
  ];
  }

  // tipos de usuario para un select
  tiposSelectPerfil() {
    return [
      {
        valor: 1,
        etiqueta: "Administrador del Sistema"
      },
      {
        valor: 2,
        etiqueta: "Administrador"
      },
      {
        valor: 3,
        etiqueta: "Editor"
      },
      {
        valor: 4,
        etiqueta: "Lector"
      }
    ];
  }
}
