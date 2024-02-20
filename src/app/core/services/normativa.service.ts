import { Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NormativaService {

  path = "normativas";

  constructor(private storage: Storage, private firestore: Firestore) { }

  crearNormativa(normativa: any) {
    const normativaRef = collection(this.firestore, this.path);
    return addDoc(normativaRef, normativa);
  }

  obtenerNormativas() {
    const normativasRef = collection(this.firestore, this.path);
    return collectionData(normativasRef, {idField: 'id'}) as Observable<any[]>;
  }

  obtenerNormativa(id: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(normativaRef);
  }

  editarNormativa(normativa: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${normativa.id}`);
    return updateDoc(normativaRef, normativa);
  }

  borrarNormativa(id: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(normativaRef);
  }

  subirArchivo(archivo: any) {
    let urlArchivo = "";
    const archivoRef = ref(this.storage, `normativas/archivos/${archivo.name}`);
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

  obtenerArchivo(ruta: any) {
    const archivoRef = ref(this.storage, `normativas/archivos/${ruta}`);
    return getDownloadURL(archivoRef);
  }
}
