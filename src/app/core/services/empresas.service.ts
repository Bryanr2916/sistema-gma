import { Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from '@angular/fire/storage';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  path = "empresas";

  constructor(private storage: Storage, private firestore: Firestore) { }

  crearEmpresa(empresa: any) {
    const empresaRef = collection(this.firestore, this.path);
    return addDoc(empresaRef, {...empresa, fechaCreacion: serverTimestamp()});
  }

  obtenerEmpresas() {
    const empresasRef = collection(this.firestore, this.path);
    return collectionData(empresasRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerEmpresa(id: any) {
    const empresaRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(empresaRef);
  }

  subirArchivo(archivo: any) {
    let urlArchivo = "";
    const archivoRef = ref(this.storage, `empresas/logos/${archivo.name}`);
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
      // Handle unsuccessful uploads
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

  borrarArchivo(url: string) {
    const archivoRef = ref(this.storage, url);
    return deleteObject(archivoRef);
  }

  editarEmpresa(empresa: any) {
    const empresaRef = doc(this.firestore, `${this.path}/${empresa.id}`);
    return updateDoc(empresaRef, {...empresa, fechaEdicion: serverTimestamp()});
  }

  borrarEmpresa(id: any) {
    const empresaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(empresaRef);
  }
}
