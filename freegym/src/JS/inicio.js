import { JSONBIN_ID, JSONBIN_KEY } from "./config.js"; 
import { setUsuario } from "./store.js";

let usuarios = [];
let esLogin = true;

// Elementos
const formTitle = document.getElementById("formTitle");
const form = document.getElementById("formulario");
const submitBtn = document.getElementById("submitBtn");
const toggleForm = document.getElementById("toggleForm");
const guestBtn = document.getElementById("guestBtn");
const nombreInput = document.getElementById("nombre");
const contraseñaInput = document.getElementById("contraseña");
const confirmarContraseñaInput = document.getElementById("confirmarContraseña");
const rolSelect = document.getElementById("rolSelect");

function animarCampos() {
  document.querySelectorAll(".fade-slide").forEach(campo => {
    campo.classList.remove("show");
    setTimeout(() => campo.classList.add("show"), 50);
  });
}

async function cargarUsuarios() {
  if (!localStorage.getItem("usuarios")) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Access-Key": JSONBIN_KEY }
      });
      const data = await res.json();
      usuarios = data.record;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } catch (err) {
      console.error("Error cargando JSONBin:", err);
    }
  } else {
    usuarios = JSON.parse(localStorage.getItem("usuarios"));
  }
}

toggleForm.addEventListener("click", () => {
  esLogin = !esLogin;
  formTitle.textContent = esLogin ? "Iniciar Sesión" : "Crear Cuenta";
  submitBtn.textContent = esLogin ? "Iniciar Sesión" : "Crear Cuenta";
  toggleForm.textContent = esLogin ? "Crear cuenta" : "Iniciar sesión";
  confirmarContraseñaInput.style.display = esLogin ? "none" : "block";
  rolSelect.style.display = esLogin ? "none" : "block";
  animarCampos();
});

// 🚀 Manejo de envío del formulario
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await cargarUsuarios();

  const nombre = nombreInput.value.trim();
  const contraseña = contraseñaInput.value.trim();
  const confirmar = confirmarContraseñaInput.value.trim();
  const rol = rolSelect.value;

  if (!nombre || !contraseña) return alert("Completa todos los campos");

  if (esLogin) {
    // Iniciar sesión
    const usuario = usuarios.find(u => u.nombre === nombre && u.contraseña === contraseña);
    if (usuario) {
      setUsuario(usuario);
      window.location.href = "rutinas.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } else {
    // Crear cuenta
    if (contraseña !== confirmar) return alert("Las contraseñas no coinciden");
    if (usuarios.find(u => u.nombre === nombre)) return alert("El usuario ya existe");

    const nuevoUsuario = { nombre, contraseña, rol, rutinas: [] };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    setUsuario(nuevoUsuario);

    try {
      await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Access-Key": JSONBIN_KEY },
        body: JSON.stringify(usuarios)
      });
    } catch (err) { 
      console.error("Error guardando en JSONBin:", err); 
    }

    window.location.href = "rutinas.html";
  }

  // Limpiar inputs
  nombreInput.value = contraseñaInput.value = confirmarContraseñaInput.value = "";
});

// 🚀 Botón Invitado
guestBtn.addEventListener("click", (event) => {
  event.preventDefault();
  setUsuario({ nombre: "Invitado", rol: "invitado", rutinas: [] });
  window.location.href = "rutinas.html";
});
