import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  deleteField,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type DocumentData,
  type UpdateData,
  type WhereFilterOp,
} from '@angular/fire/firestore';

type WhereClause = readonly [field: string, op: WhereFilterOp, value: unknown];

export type BulkFieldUpdateOptions = {
  where?: readonly WhereClause[];
  alsoSetEditedTimestamp?: boolean;
  /**
   * Max updates per batch. Firestore limit is 500 writes/batch; keep a buffer.
   */
  batchSize?: number;
};

export type BulkFieldUpdateResult = {
  matchedDocs: number;
  committedBatches: number;
};

@Injectable({
  providedIn: 'root',
})
export class FirestoreFieldService {
  constructor(private firestore: Firestore) {}

  // agrega o modifica un campo de manera masiva
  async setFieldBulk(
    collectionPath: string,
    field: string,
    value: unknown,
    opts: BulkFieldUpdateOptions = {}
  ): Promise<BulkFieldUpdateResult> {
    return this.applyFieldUpdateBulk(collectionPath, field, value, opts);
  }

  // elimina un campo de manera masiva
  async deleteFieldBulk(
    collectionPath: string,
    field: string,
    opts: BulkFieldUpdateOptions = {}
  ): Promise<BulkFieldUpdateResult> {
    return this.applyFieldUpdateBulk(collectionPath, field, deleteField(), opts);
  }

  // utilizado para set y delete bulk
  private async applyFieldUpdateBulk(
    collectionPath: string,
    field: string,
    valueOrDeleteSentinel: unknown,
    opts: BulkFieldUpdateOptions
  ): Promise<BulkFieldUpdateResult> {
    const alsoSetEditedTimestamp = opts.alsoSetEditedTimestamp ?? true;
    const batchSize = opts.batchSize ?? 450;

    if (!collectionPath) throw new Error('collectionPath is required');
    if (!field) throw new Error('field is required');
    if (batchSize <= 0 || batchSize >= 500) {
      throw new Error('batchSize must be between 1 and 499');
    }

    const colRef = collection(this.firestore, collectionPath);
    const q = this.buildQuery(colRef, opts.where);
    const snap = await getDocs(q);

    const docs = snap.docs;
    if (docs.length === 0) return { matchedDocs: 0, committedBatches: 0 };

    let committedBatches = 0;
    for (let i = 0; i < docs.length; i += batchSize) {
      const chunk = docs.slice(i, i + batchSize);
      const batch = writeBatch(this.firestore);

      for (const d of chunk) {
        const update: UpdateData<DocumentData> = { [field]: valueOrDeleteSentinel } as UpdateData<DocumentData>;
        if (alsoSetEditedTimestamp) update['fechaEdicion'] = serverTimestamp();
        batch.update(d.ref, update);
      }

      await batch.commit();
      committedBatches += 1;
    }

    return { matchedDocs: docs.length, committedBatches };
  }

  private buildQuery(
    colRef: ReturnType<typeof collection>,
    whereClauses?: readonly WhereClause[]
  ) {
    if (!whereClauses || whereClauses.length === 0) return query(colRef);

    const constraints = whereClauses.map(([field, op, value]) => where(field, op, value));
    return query(colRef, ...constraints);
  }
}

