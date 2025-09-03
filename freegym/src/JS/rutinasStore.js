// src/JS/rutinasStore.js
import { getUsuario, setUsuario, getRutinasInternas, setRutinasInternas } from "./store.js";

// Agregar rutina
export function addRutina(rutina) {
  const usuario = getUsuario();
  usuario.rutinas = usuario.rutinas || [];
  usuario.rutinas.push(rutina);
  setUsuario(usuario);

  // Agregar también a la base interna
  const internas = getRutinasInternas();
  internas.push(rutina);
  setRutinasInternas(internas);
}

// Actualizar rutina
export function updateRutina(index, rutina) {
  const usuario = getUsuario();
  usuario.rutinas[index] = rutina;
  setUsuario(usuario);

  const internas = getRutinasInternas();
  internas[index] = rutina;
  setRutinasInternas(internas);
}

// Eliminar rutina
export function deleteRutina(index) {
  const usuario = getUsuario();
  usuario.rutinas.splice(index, 1);
  setUsuario(usuario);

  const internas = getRutinasInternas();
  internas.splice(index, 1);
  setRutinasInternas(internas);
}
