export function getUsuario() {
  return JSON.parse(localStorage.getItem("usuarioActivo") || "null");
}

export function setUsuario(usuario) {
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
}

export function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
}
