import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  path = environment.production ? "permisos" : "permisos-dev";

  constructor(private storage: Storage, private firestore: Firestore) { }

  crearPermiso(permiso: any) {
    const permisoRef = collection(this.firestore, this.path);
    return addDoc(permisoRef, {...permiso, fechaCreacion: serverTimestamp()});
  }

  obtenerPermisos() {
    const permisosRef = collection(this.firestore, this.path);
    return collectionData(permisosRef, {idField: 'id'}) as Observable<any[]>;
  }
  
  obtenerPermiso(id: any) {
    const permisoRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(permisoRef);
  }
  
  subirArchivo(archivo: any) {
    const urlPath = environment.production ? `empresas/permisos/${archivo.name}` : `empresas/permisos-dev/${archivo.name}`;
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
    const urlPath = environment.production ? `empresas/permisos/${archivo.name}` : `empresas/permisos-dev/${archivo.name}`;
    const archivoRef = ref(this.storage, urlPath);
    const tareaSubirArchivo = uploadBytesResumable(archivoRef, archivo);
    return tareaSubirArchivo;
  }
  
  borrarArchivo(url: string) {
    const archivoRef = ref(this.storage, url);
    return deleteObject(archivoRef);
  }
  
  editarPermiso(permiso: any) {
    const permisoRef = doc(this.firestore, `${this.path}/${permiso.id}`);
    return updateDoc(permisoRef, {...permiso, fechaEdicion: serverTimestamp()});
  }
  
  borrarPermiso(id: any) {
    const permisoRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(permisoRef);
  }
}
