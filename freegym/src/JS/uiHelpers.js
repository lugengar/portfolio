// src/JS/uiHelpers.js
export function crearElemento(tag, className = "", text = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

export function crearBoton(text, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.classList.add("boton");
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
}
