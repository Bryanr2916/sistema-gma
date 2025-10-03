import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

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