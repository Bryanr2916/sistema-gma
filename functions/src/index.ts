import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

export const matrizBorrarArticulos = onDocumentDeleted("matrices/{matrizId}", async (event) => {
    const { matrizId } = event.params;
    logger.info(`Matriz eliminada: ${matrizId}, borrando artículos relacionados...`);

    const articulosSnap = await db
      .collection("articulos")
      .where("matrizId", "==", matrizId)
      .get();

     if (articulosSnap.empty) {
      logger.info("No hay artículos relacionados.");
      return;
    }

    // Batch para eliminarlos
    const batch = db.batch();
    articulosSnap.docs.forEach((doc) => batch.delete(doc.ref));

    const response = await batch.commit();
    logger.info(`Se borraron ${articulosSnap.size} artículos relacionados con matriz ${matrizId}`);
    return response;
});

export const matrizBorrarArticulosDev = onDocumentDeleted("matrices-dev/{matrizId}", async (event) => {
  const { matrizId } = event.params;
  logger.info(`Matriz eliminada: ${matrizId}, borrando artículos relacionados...`);

  const articulosSnap = await db
    .collection("articulos-dev")
    .where("matrizId", "==", matrizId)
    .get();

  if (articulosSnap.empty) {
    logger.info("No hay artículos relacionados.");
    return;
  }

  // Batch para eliminarlos
  const batch = db.batch();
  articulosSnap.docs.forEach((doc) => batch.delete(doc.ref));

  const response = await batch.commit();
  logger.info(`Se borraron ${articulosSnap.size} artículos relacionados con matriz ${matrizId}`);
  return response;
});

export const borrarUsuarioAuth = onDocumentDeleted("usuarios/{usuarioId}", async (event) => {
  const usuarioEliminado = event.data?.data();

  if (!usuarioEliminado) return;

  const uid = usuarioEliminado["uid"];

  if (!uid) return;

  try {
    const response = await auth.deleteUser(uid);
    return response;
  } catch(_) {
    return;
  }
});

export const borrarUsuarioAuthDev = onDocumentDeleted("usuarios-dev/{usuarioId}", async (event) => {
  const usuarioEliminado = event.data?.data();

  if (!usuarioEliminado) return;

  const uid = usuarioEliminado["uid"];

  if (!uid) return;

  try {
    const response = await auth.deleteUser(uid);
    return response;
  } catch (_) {
    return;
  }
});

export const normativaBorrarArchivo = onDocumentDeleted("normativas/{normativaId}", async (event) => {
  const normativaEliminada = event.data?.data();

  if (!normativaEliminada) return;

  const urlArchivo = normativaEliminada["urlArchivo"];

  if (!urlArchivo) return;

  const url = decodeURIComponent(urlArchivo);
  const filename = url.split('/o/')[1].split('?')[0];

  try {
    const response = await bucket.file(filename).delete();
    return response;
  } catch (_) {
    return;
  }

});

export const normativaBorrarArchivoDev = onDocumentDeleted("normativas-dev/{normativaId}", async (event) => {
  const normativaEliminada = event.data?.data();

  if (!normativaEliminada) return;

  const urlArchivo = normativaEliminada["urlArchivo"];

  if (!urlArchivo) return;

  const url = decodeURIComponent(urlArchivo);
  const filename = url.split('/o/')[1].split('?')[0];

  try {
    const response = await bucket.file(filename).delete();
    return response;
  } catch (_) {
    return;
  }

});

export const empresaBorrarLogo = onDocumentDeleted("empresas/{empresaId}", async (event) => {
  const empresaEliminada = event.data?.data();

  if (!empresaEliminada) return;

  const urlLogo = empresaEliminada["urlLogo"];

  if (!urlLogo) return;

  const url = decodeURIComponent(urlLogo);
  const filename = url.split('/o/')[1].split('?')[0];

  try {
    const response = await bucket.file(filename).delete();
    return response;
  } catch (_) {
    return;
  }
});

export const empresaBorrarLogoDev = onDocumentDeleted("empresas/{empresaId}", async (event) => {
  const empresaEliminada = event.data?.data();

  if (!empresaEliminada) return;

  const urlLogo = empresaEliminada["urlLogo"];

  if (!urlLogo) return;

  const url = decodeURIComponent(urlLogo);
  const filename = url.split('/o/')[1].split('?')[0];

  try {
    const response = await bucket.file(filename).delete();
    return response;
  } catch (_) {
    return;
  }
});