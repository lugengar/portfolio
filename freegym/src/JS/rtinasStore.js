import { getUsuario, setUsuario } from "./store.js";

export function addRutina(rutina) {
  const usuario = getUsuario();
  usuario.rutinas = usuario.rutinas || [];
  usuario.rutinas.push(rutina);
  setUsuario(usuario);
}

export function updateRutina(index, rutina) {
  const usuario = getUsuario();
  usuario.rutinas[index] = rutina;
  setUsuario(usuario);
}

export function deleteRutina(index) {
  const usuario = getUsuario();
  usuario.rutinas.splice(index,1);
  setUsuario(usuario);
}
