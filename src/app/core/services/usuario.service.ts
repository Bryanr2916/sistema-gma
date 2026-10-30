import { Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, sendPasswordResetEmail, User } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, query, where, orderBy, getDocs, serverTimestamp } from '@angular/fire/firestore';
import { EncriptadorService } from './encriptador.service';
import { AuditoriaService } from './auditoria.service';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import { rutaDatos } from 'src/app/core/entorno-datos';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  path = rutaDatos("usuarios");

  // todo: usar usuarioCache para optimizar llamados a la db
  private usuarioCache$ = new BehaviorSubject<any | null>(null); // Cache user data

  constructor(private auth: Auth, private firestore: Firestore, private encriptador: EncriptadorService, private auditoria: AuditoriaService) { }

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
    localStorage.removeItem('logo_empresa');
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

  async crearUsuario( usuario:any ) {
    const usuarioRef = collection(this.firestore, this.path);
    const referencia = await addDoc(usuarioRef,
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

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: usuario.empresaId ?? null,
      cambios: this.auditoria.calcularCambios({}, usuario, ['contrasena'])
    });

    return referencia;
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.firestore, this.path);
    const q = query(usuariosRef, orderBy('fechaCreacion', 'desc'));
    return collectionData(q, {idField: 'id'}) as Observable<any[]>;
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

  async editarUsuario(usuario: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, usuario.id);
    const usuarioref = doc(this.firestore, `${this.path}/${usuario.id}`);
    await updateDoc(usuarioref, {...usuario, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'modificar',
      documentoId: usuario.id,
      empresaId: usuario.empresaId ?? previa?.empresaId ?? null,
      cambios: this.auditoria.calcularCambios(previa, usuario, ['contrasena'])
    });
  }

  reestablecerContrasena(correo: string) {
    return sendPasswordResetEmail(this.auth, correo);
  }

  async borrarUsuario(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, id);
    const usuarioRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(usuarioRef);

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresaId ?? null,
      datosPrevios: previa ?? null
    });
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
