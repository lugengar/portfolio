// src/JS/store.js

// Usuario activo
export function getUsuario() {
  return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
}

export function setUsuario(usuario) {
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
}

// Rutinas internas (localStorage) para uso del sistema
export function getRutinasInternas() {
  return JSON.parse(localStorage.getItem("rutinasInternas") || "[]");
}

export function setRutinasInternas(rutinas) {
  localStorage.setItem("rutinasInternas", JSON.stringify(rutinas));
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem("usuarioActivo");
  localStorage.removeItem("rutinasInternas");
  window.location.href = "index.html";
}
