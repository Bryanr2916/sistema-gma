import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, deleteDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { rutaDatos } from 'src/app/core/entorno-datos';
import { AuditoriaService } from './auditoria.service';

@Injectable({
  providedIn: 'root'
})

export class RiesgosService {

    path = rutaDatos("riesgos");

    constructor(private firestore: Firestore, private auditoria: AuditoriaService) { }

    filaRiesgo() {
        const riesgo = {
            actividad: "",
            aspectoAmbiental: "",
            impacto: "",
            p: 1,
            s: 1,
            control: "",
            accion: ""
        }

        return riesgo;
    }

    rangoClasificaciones() {
        const cl = {
            bajo: 4,
            medio: 9
        };

        return cl;
    }

    async crearRiesgo(riesgo: any) {
        const riesgoRef = collection(this.firestore, this.path);
        const referencia = await addDoc(riesgoRef, { ...riesgo, fechaCreacion: serverTimestamp() });

        await this.auditoria.registrar({
            coleccion: this.path,
            accion: 'crear',
            documentoId: referencia.id,
            empresaId: riesgo.empresaId ?? null,
            cambios: this.auditoria.calcularCambios({}, riesgo)
        });

        return referencia;
    }

    obtenerRiesgo(id: any) {
        const riesgoRef = doc(this.firestore, `${this.path}/${id}`);
        return getDoc(riesgoRef);
    }
    
    obtenerRiesgoPorEmpresaId(empresaId: string) {
        const riesgoRef = collection(this.firestore, this.path);

        const riesgoEmpresa = query(riesgoRef, where("empresaId", "==", empresaId));
        return getDocs(riesgoEmpresa);
    }

    async editarRiesgo(riesgo: any) {
        const previa = await this.auditoria.documentoPrevio(this.path, riesgo.id);
        const riesgoRef = doc(this.firestore, `${this.path}/${riesgo.id}`);
        await updateDoc(riesgoRef, { ...riesgo, fechaEdicion: serverTimestamp() });

        await this.auditoria.registrar({
            coleccion: this.path,
            accion: 'modificar',
            documentoId: riesgo.id,
            empresaId: riesgo.empresaId ?? previa?.empresaId ?? null,
            cambios: this.auditoria.calcularCambios(previa, riesgo)
        });
    }

    obtenerTodosLosRiesgos(): Observable<any[]> {
        const riesgoRef = collection(this.firestore, this.path);
        return collectionData(riesgoRef, { idField: 'id' }) as Observable<any[]>;
    }

    async borrarRiesgo(id: string) {
        const previa = await this.auditoria.documentoPrevio(this.path, id);
        const riesgoRef = doc(this.firestore, `${this.path}/${id}`);
        await deleteDoc(riesgoRef);

        await this.auditoria.registrar({
            coleccion: this.path,
            accion: 'eliminar',
            documentoId: id,
            empresaId: previa?.empresaId ?? null,
            datosPrevios: previa ?? null
        });
    }
}
