import { Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from '@angular/fire/storage';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  getCountFromServer,
  updateDoc,
  serverTimestamp,
  query,
  limit,
  limitToLast,
  orderBy,
  startAfter,
  type QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  path = environment.useProductionData ? "empresas" : "empresas-dev";

  constructor(private storage: Storage, private firestore: Firestore) { }

  private constraintsListado() {
    return [orderBy('nombre', 'asc')];
  }

  private mapDoc(d: QueryDocumentSnapshot): any {
    return { id: d.id, ...d.data() };
  }

  /** Conteo total de documentos en la colección (para paginación). */
  async contarEmpresas(): Promise<number> {
    const empresasRef = collection(this.firestore, this.path);
    const snapshot = await getCountFromServer(empresasRef);
    return snapshot.data().count;
  }

  /** Todas las empresas del listado (para búsqueda global en cliente). */
  async obtenerTodasEmpresasListado(): Promise<any[]> {
    const empresasRef = collection(this.firestore, this.path);
    const q = query(empresasRef, ...this.constraintsListado());
    const snap = await getDocs(q);
    return snap.docs.map((d) => this.mapDoc(d));
  }

  /**
   * Una página de empresas ordenadas por nombre ascendente.
   * @param tamanoPagina Tamaño de página (p. ej. 20).
   * @param cursorAnterior Último documento de la página anterior; null para la primera página.
   */
  async obtenerEmpresasPagina(
    tamanoPagina: number,
    cursorAnterior: QueryDocumentSnapshot | null
  ): Promise<{ items: any[]; ultimoDoc: QueryDocumentSnapshot | null }> {
    const empresasRef = collection(this.firestore, this.path);
    const constraints = [...this.constraintsListado(), limit(tamanoPagina)];
    const q =
      cursorAnterior === null
        ? query(empresasRef, ...constraints)
        : query(empresasRef, ...constraints, startAfter(cursorAnterior));

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => this.mapDoc(d));
    const ultimoDoc =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
    return { items, ultimoDoc };
  }

  /**
   * Obtiene varias páginas consecutivas en una sola consulta a Firestore.
   * @param cursorInicio Cursor de la página `paginaInicio`; null si se parte del inicio.
   * @param paginaInicio Número de la última página ya resuelta (0 = inicio de colección).
   * @param paginaDestino Página final a incluir en el rango.
   */
  async obtenerRangoPaginas(
    cursorInicio: QueryDocumentSnapshot | null,
    paginaInicio: number,
    paginaDestino: number,
    tamanoPagina: number
  ): Promise<Map<number, { items: any[]; ultimoDoc: QueryDocumentSnapshot | null }>> {
    const resultado = new Map<
      number,
      { items: any[]; ultimoDoc: QueryDocumentSnapshot | null }
    >();
    const paginasFaltantes = paginaDestino - paginaInicio;
    if (paginasFaltantes <= 0) {
      return resultado;
    }

    const empresasRef = collection(this.firestore, this.path);
    const constraints = [
      ...this.constraintsListado(),
      limit(paginasFaltantes * tamanoPagina),
    ];
    const q =
      cursorInicio === null
        ? query(empresasRef, ...constraints)
        : query(empresasRef, ...constraints, startAfter(cursorInicio));

    const snap = await getDocs(q);
    const docs = snap.docs;

    for (let i = 0; i < paginasFaltantes; i++) {
      const pagina = paginaInicio + i + 1;
      const inicio = i * tamanoPagina;
      const chunk = docs.slice(inicio, inicio + tamanoPagina);
      if (chunk.length === 0) {
        break;
      }
      resultado.set(pagina, {
        items: chunk.map((d) => this.mapDoc(d)),
        ultimoDoc: chunk[chunk.length - 1],
      });
    }

    return resultado;
  }

  /** Última página del listado (documentos más recientes) en una sola consulta. */
  async obtenerUltimaPagina(
    tamanoPagina: number,
    totalRegistros: number,
    totalPaginas: number
  ): Promise<{ items: any[]; ultimoDoc: QueryDocumentSnapshot | null }> {
    const tamanoUltimaPagina =
      totalRegistros - (totalPaginas - 1) * tamanoPagina;
    const empresasRef = collection(this.firestore, this.path);
    const q = query(
      empresasRef,
      ...this.constraintsListado(),
      limitToLast(tamanoUltimaPagina)
    );

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => this.mapDoc(d));
    const ultimoDoc =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
    return { items, ultimoDoc };
  }

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
    const urlPath = environment.useProductionData ? `empresas/logos/${archivo.name}` : `empresas/logos-dev/${archivo.name}`;
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
