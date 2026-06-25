import { TIPOS_USUARIO } from '../services/constantes';

export function esEditorOMayor(tipoUsuario: number): boolean {
  return tipoUsuario === TIPOS_USUARIO.adminSistema ||
         tipoUsuario === TIPOS_USUARIO.admin ||
         tipoUsuario === TIPOS_USUARIO.editor;
}
