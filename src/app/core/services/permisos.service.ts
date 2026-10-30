import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { rutaDatos } from 'src/app/core/entorno-datos';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  path = rutaDatos("permisos");

  constructor(private storage: Storage, private firestore: Firestore, private auditoria: AuditoriaService) { }

  async crearPermiso(permiso: any) {
    const permisoRef = collection(this.firestore, this.path);
    const referencia = await addDoc(permisoRef, {...permiso, fechaCreacion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'crear',
      documentoId: referencia.id,
      empresaId: permiso.empresaId ?? null,
      cambios: this.auditoria.calcularCambios({}, permiso)
    });

    return referencia;
  }

  obtenerPermisos(
    empresaId: string,
    callback: (permisos: any[]) => void
  ) {
    const permisosRef = collection(this.firestore, this.path);

    const q = query(
      permisosRef,
      where("empresaId", "==", empresaId),
      orderBy('fechaCreacion', 'desc')
    );

    return onSnapshot(q , snapshot => {
      const permisos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      callback(permisos);
    });
  }
  
  obtenerTodosLosPermisos(
    callback: (permisos: any[]) => void
  ) {
    const permisosRef = collection(this.firestore, this.path);

    const q = query(permisosRef, orderBy('fechaCreacion', 'desc'));

    return onSnapshot(q, snapshot => {
      const permisos = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      callback(permisos);
    });
  }

  obtenerPermiso(id: any) {
    const permisoRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(permisoRef);
  }
  
  subirArchivo(archivo: any) {
    const urlPath = rutaDatos(`empresas/permisos/${archivo.name}`, `empresas/permisos-dev/${archivo.name}`);
    let urlArchivo = "";
    const archivoRef = ref(this.storage, urlPath);
    const tareaSubirArchivo = uploadBytesResumable(archivoRef, archivo);

    return new Promise<string> ((resolve, reject) => {
      tareaSubirArchivo.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, (error) => {
      console.log(error);
      reject(error);
      urlArchivo = error.message;
    }, () => {
      getDownloadURL(tareaSubirArchivo.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        resolve(downloadURL);
      });
    });  
    });
  }

  // para manejar el progress en el componente usado
  subirArchivoAlt(archivo: any) {
    const urlPath = rutaDatos(`empresas/permisos/${archivo.name}`, `empresas/permisos-dev/${archivo.name}`);
    const archivoRef = ref(this.storage, urlPath);
    const tareaSubirArchivo = uploadBytesResumable(archivoRef, archivo);
    return tareaSubirArchivo;
  }
  
  borrarArchivo(url: string) {
    const archivoRef = ref(this.storage, url);
    return deleteObject(archivoRef);
  }
  
  async editarPermiso(permiso: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, permiso.id);
    const permisoRef = doc(this.firestore, `${this.path}/${permiso.id}`);
    await updateDoc(permisoRef, {...permiso, fechaEdicion: serverTimestamp()});

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'modificar',
      documentoId: permiso.id,
      empresaId: permiso.empresaId ?? previa?.empresaId ?? null,
      cambios: this.auditoria.calcularCambios(previa, permiso)
    });
  }

  async borrarPermiso(id: any) {
    const previa = await this.auditoria.documentoPrevio(this.path, id);
    const permisoRef = doc(this.firestore, `${this.path}/${id}`);
    await deleteDoc(permisoRef);

    await this.auditoria.registrar({
      coleccion: this.path,
      accion: 'eliminar',
      documentoId: id,
      empresaId: previa?.empresaId ?? null,
      datosPrevios: previa ?? null
    });
  }
}
