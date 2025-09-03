// src/JS/inicio.js
import { USUARIOS_ID, JSONBIN_KEY } from "./config.js";

// Elementos del DOM
const formulario = document.getElementById("formulario");
const nombreInput = document.getElementById("nombre");
const contraseñaInput = document.getElementById("contraseña");
const confirmarContraseñaInput = document.getElementById("confirmarContraseña");
const rolSelect = document.getElementById("rolSelect");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleForm = document.getElementById("toggleForm");
const guestBtn = document.getElementById("guestBtn");

let esLogin = true;
let cuentas = [];

// --- Funciones auxiliares ---
async function obtenerCuentas() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${USUARIOS_ID}/latest`, {
      headers: { "X-Access-Key": JSONBIN_KEY }
    });
    const data = await res.json();
    cuentas = data.record || [];
  } catch (e) {
    console.error("Error al cargar las cuentas:", e);
    cuentas = [];
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function guardarSesion(usuario) {
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
}

// --- Lógica de formulario ---
toggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  esLogin = !esLogin;

  if (esLogin) {
    formTitle.textContent = "Iniciar Sesión";
    submitBtn.textContent = "Iniciar Sesión";
    confirmarContraseñaInput.style.display = "none";
    rolSelect.style.display = "none";
    toggleForm.textContent = "Crear cuenta";
  } else {
    formTitle.textContent = "Crear Cuenta";
    submitBtn.textContent = "Crear Cuenta";
    confirmarContraseñaInput.style.display = "block";
    rolSelect.style.display = "block";
    toggleForm.textContent = "Ya tengo cuenta";
  }
});

guestBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const invitado = { nombre: "Invitado", ID: "guest", rol: "casual" };
  guardarSesion(invitado);
  alert("Sesión iniciada como invitado");
  window.location.href = "home.html";
});

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = nombreInput.value.trim();
  const contraseña = contraseñaInput.value;

  if (!nombre || !contraseña) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (esLogin) {
    await obtenerCuentas();
    const hashed = await hashPassword(contraseña);
    const usuario = cuentas.find(u => u.nombre === nombre && u.contraseña === hashed);
    if (usuario) {
      guardarSesion(usuario);
      alert("Sesión iniciada con éxito");
      window.location.href = "home.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  } else {
    const confirmar = confirmarContraseñaInput.value;
    const rol = rolSelect.value;
    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    await obtenerCuentas();
    if (cuentas.some(u => u.nombre === nombre)) {
      alert("El nombre de usuario ya existe");
      return;
    }

    const hashed = await hashPassword(contraseña);
    const nuevoUsuario = {
      nombre,
      contraseña: hashed,
      ID: crypto.randomUUID(),
      rol
    };

    cuentas.push(nuevoUsuario);

    try {
      await fetch(`https://api.jsonbin.io/v3/b/${USUARIOS_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Key": JSONBIN_KEY,
          "X-Bin-Versioning": "false"
        },
        body: JSON.stringify(cuentas)
      });
      guardarSesion(nuevoUsuario);
      alert("Cuenta creada con éxito");
      window.location.href = "home.html";
    } catch (e) {
      console.error("Error al guardar la cuenta:", e);
      alert("No se pudo crear la cuenta");
    }
  }
});
