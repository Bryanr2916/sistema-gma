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
export class NormativaService {

  path = environment.useProductionData ? "normativas" : "normativas-dev";

  constructor(private storage: Storage, private firestore: Firestore) { }

  private constraintsListado() {
    return [orderBy('fechaCreacion', 'desc')];
  }

  private mapDoc(d: QueryDocumentSnapshot): any {
    return { id: d.id, ...d.data() };
  }

  crearNormativa(normativa: any) {
    const normativaRef = collection(this.firestore, this.path);
    return addDoc(normativaRef, {...normativa, fechaCreacion: serverTimestamp()});
  }

  obtenerNormativas(cantidad: number = Infinity) {
    const normativasRef = collection(this.firestore, this.path);

    const q = query(
      normativasRef,
      orderBy("fechaCreacion", "desc"),
      limit(cantidad));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  /** Conteo total de documentos en la colección (para paginación). */
  async contarNormativas(): Promise<number> {
    const normativasRef = collection(this.firestore, this.path);
    const snapshot = await getCountFromServer(normativasRef);
    return snapshot.data().count;
  }

  /** Todas las normativas del listado (para búsqueda global en cliente). */
  async obtenerTodasNormativasListado(): Promise<any[]> {
    const normativasRef = collection(this.firestore, this.path);
    const q = query(normativasRef, ...this.constraintsListado());
    const snap = await getDocs(q);
    return snap.docs.map((d) => this.mapDoc(d));
  }

  /**
   * Una página de normativas ordenadas por fechaCreacion descendente.
   * @param tamanoPagina Tamaño de página (p. ej. 20).
   * @param cursorAnterior Último documento de la página anterior; null para la primera página.
   */
  async obtenerNormativasPagina(
    tamanoPagina: number,
    cursorAnterior: QueryDocumentSnapshot | null
  ): Promise<{ items: any[]; ultimoDoc: QueryDocumentSnapshot | null }> {
    const normativasRef = collection(this.firestore, this.path);
    const constraints = [...this.constraintsListado(), limit(tamanoPagina)];
    const q =
      cursorAnterior === null
        ? query(normativasRef, ...constraints)
        : query(normativasRef, ...constraints, startAfter(cursorAnterior));

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

    const normativasRef = collection(this.firestore, this.path);
    const constraints = [
      ...this.constraintsListado(),
      limit(paginasFaltantes * tamanoPagina),
    ];
    const q =
      cursorInicio === null
        ? query(normativasRef, ...constraints)
        : query(normativasRef, ...constraints, startAfter(cursorInicio));

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

  /** Última página del listado (documentos más antiguos) en una sola consulta. */
  async obtenerUltimaPagina(
    tamanoPagina: number,
    totalRegistros: number,
    totalPaginas: number
  ): Promise<{ items: any[]; ultimoDoc: QueryDocumentSnapshot | null }> {
    const tamanoUltimaPagina =
      totalRegistros - (totalPaginas - 1) * tamanoPagina;
    const normativasRef = collection(this.firestore, this.path);
    const q = query(
      normativasRef,
      ...this.constraintsListado(),
      limitToLast(tamanoUltimaPagina)
    );

    const snap = await getDocs(q);
    const items = snap.docs.map((d) => this.mapDoc(d));
    const ultimoDoc =
      snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
    return { items, ultimoDoc };
  }

  obtenerNormativa(id: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${id}`);
    return getDoc(normativaRef);
  }

  editarNormativa(normativa: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${normativa.id}`);
    return updateDoc(normativaRef, {...normativa, fechaEdicion: serverTimestamp()});
  }

  borrarNormativa(id: any) {
    const normativaRef = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(normativaRef);
  }

  // para manejar el progress en el componente usado
  subirArchivoAlt(archivo: any) {
    const urlPath = environment.useProductionData ? `normativas/archivos/${archivo.name}` : `normativas/archivos-dev/${archivo.name}`;
    const archivoRef = ref(this.storage, urlPath);
    const tareaSubirArchivo = uploadBytesResumable(archivoRef, archivo);
    return tareaSubirArchivo;
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

  borrarArchivo(url: string) {
    const archivoRef = ref(this.storage, url);
    return deleteObject(archivoRef);
  }

  obtenerArchivo(ruta: any) {
    const archivoRef = ref(this.storage, `normativas/archivos/${ruta}`);
    return getDownloadURL(archivoRef);
  }
}
