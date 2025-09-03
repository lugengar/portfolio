import { getUsuario } from "./store.js";
import { USUARIOS_ID, JSONBIN_KEY } from "./config.js";

const button = document.getElementById("butsidebar");
const sidebar = document.getElementById("sidebar");
let abierto = false;

button.addEventListener("click", () => {
  if (!abierto) {
    sidebar.style.left = "0%"; // mostrar sidebar
    button.textContent = "✖";
    abierto = true;
  } else {
    sidebar.style.left = "100%"; // ocultar sidebar
    button.textContent = "☰";
    abierto = false;
  }
});

// Guardar todos los usuarios en JSONBin
async function guardarUsuariosOnline(usuarios) {
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${USUARIOS_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": JSONBIN_KEY,
        "X-Bin-Versioning": "false"
      },
      body: JSON.stringify(usuarios)
    });
  } catch (err) {
    console.error("Error guardando en JSONBin:", err);
  }
}

// Cerrar sesión
export async function cerrarsesion() {
  const usuario = getUsuario();

  // Solo guardar en JSONBin si no es invitado
  if (usuario && usuario.ID !== "guest") {
    // Traer la lista actual de usuarios desde localStorage o JSONBin
    let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    // Actualizar el usuario activo en la lista
    const i = usuarios.findIndex(u => u.nombre === usuario.nombre);
    if (i >= 0) {
      usuarios[i] = usuario;
    } else {
      usuarios.push(usuario); // si no existía, agregarlo
    }

    // Guardar en JSONBin
    await guardarUsuariosOnline(usuarios);
  }

  // Limpiar base interna
  localStorage.removeItem("usuarioActivo");
  localStorage.removeItem("rutinasInternas"); // opcional, si querés limpiar todo

  // Redirigir al inicio
  window.location.href = "index.html";
}

// Navegación
function compartir() { window.location.href = "compartir.html"; }
function home() { window.location.href = "home.html"; }
function progreso() { window.location.href = "historial.html"; }

window.compartir = compartir;
window.home = home;
window.progreso = progreso;
window.cerrarsesion = cerrarsesion;
