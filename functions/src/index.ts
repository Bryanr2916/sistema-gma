import { onDocumentDeleted, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { BrevoClient } from "@getbrevo/brevo";

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

export const empresaBorrarLogoDev = onDocumentDeleted("empresas-dev/{empresaId}", async (event) => {
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

export const permisoBorrarArchivo = onDocumentDeleted("permisos/{permisoId}", async (event) =>{
  const permisoEliminado = event.data?.data();

  if (!permisoEliminado) return;

  const urlArchivo = permisoEliminado["urlArchivo"];

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

export const permisoBorrarArchivoDev = onDocumentDeleted("permisos-dev/{permisoId}", async (event) => {
  const permisoEliminado = event.data?.data();

  if (!permisoEliminado) return;

  const urlArchivo = permisoEliminado["urlArchivo"];

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

export const empresaBorrarMatrices = onDocumentDeleted("empresas/{empresaId}", async (event) => {
  const { empresaId } = event.params;
  logger.info(`Empresa eliminada: ${empresaId}, borrando matrices relacionados...`);
  const empresaEliminada = event.data?.data();

  if (!empresaEliminada) return;

  const matricesSnap = await db
  .collection("matrices")
  .where("empresa", "==", empresaId)
  .get();

  if (matricesSnap.empty) {
    logger.info("No hay matrices relacionadas.");
    return;
  }

  const batch = db.batch();
  matricesSnap.docs.forEach((doc) => batch.delete(doc.ref));

  const response = await batch.commit();
  logger.info(`Se borraron ${matricesSnap.size} matrices relacionadas con empresa ${empresaId}`);
  return response;
});

export const empresaBorrarMatricesDev = onDocumentDeleted("empresas-dev/{empresaId}", async (event) => {
  const { empresaId } = event.params;
  logger.info(`Empresa eliminada: ${empresaId}, borrando matrices relacionados...`);
  const empresaEliminada = event.data?.data();

  if (!empresaEliminada) return;

  const matricesSnap = await db
    .collection("matrices-dev")
    .where("empresa", "==", empresaId)
    .get();

  if (matricesSnap.empty) {
    logger.info("No hay matrices relacionadas.");
    return;
  }

  const batch = db.batch();
  matricesSnap.docs.forEach((doc) => batch.delete(doc.ref));

  const response = await batch.commit();
  logger.info(`Se borraron ${matricesSnap.size} matrices relacionadas con empresa ${empresaId}`);
  return response;
});

export const empresaActualizarLogo = onDocumentUpdated("empresas/{empresaId}", async (event) => {
  const empresaAntes = event.data?.before.data();
  const empresaDespues = event.data?.after.data();

  if (!empresaAntes || ! empresaDespues) return;

  if (empresaAntes["urlLogo"] === empresaDespues["urlLogo"]) return;

  const urlLogo = empresaAntes["urlLogo"];

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

export const empresaActualizarLogoDev = onDocumentUpdated("empresas-dev/{empresaId}", async (event) => {
  const empresaAntes = event.data?.before.data();
  const empresaDespues = event.data?.after.data();

  if (!empresaAntes || !empresaDespues) return;

  if (empresaAntes["urlLogo"] === empresaDespues["urlLogo"]) return;

  const urlLogo = empresaAntes["urlLogo"];

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

export const sendEmailViaBrevo = onCall({ secrets: ["BREVO_API_KEY"] }, async (request) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "Brevo API key is missing.");
  }

  const apiInstance = new BrevoClient({ apiKey });

  const { toEmail, toName, subject, textContent } = request.data;

  if (!toEmail || !subject || !textContent) {
    throw new HttpsError("invalid-argument", "Missing required email fields.");
  }

  try {
    await apiInstance.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: `<html><body><p>${textContent}</p></body></html>`,
      sender: { name: "GMA Sistema", email: "bryanr2916@gmail.com" },
      to: [{ email: toEmail, name: toName || "User" }]
    });
    return { success: true, message: "Email sent successfully!" };
  } catch (error: any) {
    console.error("Brevo Error:", error);
    throw new HttpsError("internal", "Failed to send email via Brevo.", error.message);
  }
});

function getMesesRestantes(fechaVencimiento: Date): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(fechaVencimiento);
  vencimiento.setHours(0, 0, 0, 0);

  const diffMs = vencimiento.getTime() - hoy.getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return -1;
  if (diffDias === 0) return 0;

  if (vencimiento.getDate() !== hoy.getDate()) return -1;

  const meses = (vencimiento.getFullYear() - hoy.getFullYear()) * 12 +
    (vencimiento.getMonth() - hoy.getMonth());

  if (meses < 1 || meses > 3) return -1;
  return meses;
}

function formatMensajeVencimiento(nombre: string, mesesRestantes: number, fechaVencimiento: string): string {
  const fecha = new Date(fechaVencimiento);
  const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

  let tiempoRestante: string;
  if (mesesRestantes === -1) {
    tiempoRestante = 'Ya está vencido';
  } else if (mesesRestantes === 0) {
    tiempoRestante = 'Vence hoy';
  } else if (mesesRestantes === 1) {
    tiempoRestante = 'Vence en 1 mes';
  } else {
    tiempoRestante = `Vence en ${mesesRestantes} meses`;
  }

  return `El permiso "${nombre}" ${tiempoRestante}. Fecha de vencimiento: ${fechaFormateada}.`;
}

async function verificarYEnviarNotificaciones(collectionName: string, suffijo: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    logger.error(`[${suffijo}] Brevo API key is missing.`);
    return;
  }

  const apiInstance = new BrevoClient({ apiKey });
  const permisosSnap = await db.collection(collectionName).get();

  if (permisosSnap.empty) {
    logger.info(`[${suffijo}] No hay permisos en la colección ${collectionName}.`);
    return;
  }

  let emailsEnviados = 0;

  for (const doc of permisosSnap.docs) {
    const permiso = doc.data();
    const fechaVencimiento = permiso["fechaVencimiento"];

    if (!fechaVencimiento) continue;

    const mesesRestantes = getMesesRestantes(new Date(fechaVencimiento));

    if (mesesRestantes < 0 || mesesRestantes > 3) continue;

    const correos = permiso["correos"];
    if (!Array.isArray(correos) || correos.length === 0) continue;

    const nombre = permiso["nombre"] || "Sin nombre";
    const mensaje = formatMensajeVencimiento(nombre, mesesRestantes, fechaVencimiento);
    const asunto = `Notificación de vencimiento: ${nombre}`;

    for (const correo of correos) {
      const email = correo.value || correo;
      if (!email || typeof email !== 'string') continue;

      try {
        await apiInstance.transactionalEmails.sendTransacEmail({
          subject: asunto,
          htmlContent: `<html><body><p>${mensaje}</p></body></html>`,
          sender: { name: "GMA Sistema", email: "bryanr2916@gmail.com" },
          to: [{ email, name: "Usuario GMA" }]
        });
        emailsEnviados++;
        logger.info(`[${suffijo}] Email enviado a ${email} para permiso "${nombre}"`);
      } catch (error: any) {
        logger.error(`[${suffijo}] Error enviando email a ${email}:`, error);
      }
    }
  }

  logger.info(`[${suffijo}] Proceso completado. Total emails enviados: ${emailsEnviados}`);
}

export const verificarPermisosVencimiento = onSchedule({
  schedule: "every 24 hours",
  secrets: ["BREVO_API_KEY"],
  timeZone: "America/Caracas",
}, async () => {
  logger.info("[prod] Iniciando verificación de vencimiento de permisos...");
  await verificarYEnviarNotificaciones("permisos", "prod");
});

export const verificarPermisosVencimientoDev = onSchedule({
  schedule: "every 24 hours",
  secrets: ["BREVO_API_KEY"],
  timeZone: "America/Caracas",
}, async () => {
  logger.info("[dev] Iniciando verificación de vencimiento de permisos...");
  await verificarYEnviarNotificaciones("permisos-dev", "dev");
});
