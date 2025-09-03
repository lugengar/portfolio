import { ENVIAR_ID, JSONBIN_KEY } from "./config.js"; // Configura ENVIAR_ID

let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
if (!usuario) window.location.href = "index.html";

const misRutinasSelect = document.getElementById("misRutinasSelect");
const destinatarioInput = document.getElementById("destinatario");
const sugerenciasDiv = document.getElementById("sugerencias");
const enviarBtn = document.getElementById("enviarBtn");
const buzonList = document.getElementById("buzonList");

// Cargar rutinas propias
(usuario.rutinas || []).forEach((r, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = r.nombre;
    misRutinasSelect.appendChild(option);
});

// Usuarios locales para búsqueda
let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

// Mostrar sugerencias mientras escribís
destinatarioInput.addEventListener("input", () => {
    const texto = destinatarioInput.value.toLowerCase();
    const coincidencias = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(texto) &&
        u.nombre.toLowerCase() !== usuario.nombre.toLowerCase()
    );

    // Limpiar sugerencias previas
    sugerenciasDiv.innerHTML = "";
    coincidencias.forEach(u => {
        const btn = document.createElement("button");
        btn.classList.add("boton2");
        btn.textContent = u.nombre;
        btn.addEventListener("click", () => {
            destinatarioInput.value = u.nombre;
            sugerenciasDiv.innerHTML = "";
        });
        sugerenciasDiv.appendChild(btn);
    });
});

// Funciones JSONBin
async function cargarBuzonOnline() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${ENVIAR_ID}/latest`, {
        headers: { "X-Access-Key": JSONBIN_KEY }
    });
    const data = await res.json();
    return data.record || [];
}

async function guardarBuzonOnline(buzon) {
    await fetch(`https://api.jsonbin.io/v3/b/${ENVIAR_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Access-Key": JSONBIN_KEY
        },
        body: JSON.stringify(buzon)
    });
}

// Enviar rutina
enviarBtn.addEventListener("click", async () => {
    const index = misRutinasSelect.value;
    const destinatario = destinatarioInput.value.trim().toLowerCase();
    if (!destinatario) return alert("Ingresa un usuario destinatario");

    const usuarioDest = usuarios.find(u => u.nombre.toLowerCase() === destinatario);
    if (!usuarioDest) return alert("Usuario no encontrado");

    const rutina = usuario.rutinas[index];
    let buzon = await cargarBuzonOnline();
    buzon.push({ destinatario, remitente: usuario.nombre, rutina, fecha: new Date().toISOString() });
    await guardarBuzonOnline(buzon);

    alert(`Rutina enviada a ${destinatario}`);
    destinatarioInput.value = "";
    sugerenciasDiv.innerHTML = "";
    renderBuzon();
});

// Renderizar buzón de rutinas recibidas
async function renderBuzon() {
    buzonList.innerHTML = "Cargando...";
    let buzon = await cargarBuzonOnline();
    let recibidas = buzon.filter(b => b.destinatario === usuario.nombre.toLowerCase());

    if (recibidas.length === 0) {
        buzonList.innerHTML = "<p>No tienes rutinas nuevas</p>";
        return;
    }

    buzonList.innerHTML = "";
    recibidas.forEach((b, i) => {
        const div = document.createElement("div");
        div.classList.add("buzon-item");
        div.innerHTML = `<strong>${b.rutina.nombre}</strong> de ${b.remitente} (${new Date(b.fecha).toLocaleString()})`;

        const btnAceptar = document.createElement("button");
        btnAceptar.classList.add("boton");
        btnAceptar.textContent = "Aceptar";
        btnAceptar.addEventListener("click", async () => {
          usuario.rutinas = usuario.rutinas || [];
          usuario.rutinas.push(b.rutina);
          localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      
          // Guardar cambios en la nube
          try {
              await guardarRutinasEnLaNube(usuario);
              console.log("Rutinas sincronizadas en la nube");
          } catch (err) {
              console.error("Error guardando en la nube:", err);
          }
      
          // Eliminar del buzón online
          buzon = buzon.filter(item => item !== b);
          await guardarBuzonOnline(buzon);
          renderBuzon();
          alert("Rutina aceptada y agregada a tus rutinas");
      });
      

        div.appendChild(btnAceptar);
        buzonList.appendChild(div);
    });
}

// Inicializar buzón
renderBuzon();
