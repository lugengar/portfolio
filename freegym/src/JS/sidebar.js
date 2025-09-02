import { getUsuario } from "./store.js";

const usuario = getUsuario();
const button = document.getElementById("butsidebar");
const sidebar = document.getElementById("sidebar");
let abierto = false;

button.addEventListener("click", () => {
    if (!abierto) {
        sidebar.style.left = "0%"; // lo mueve a la pantalla
        button.textContent = "✖"; // cambia a X
        abierto = true;
    } else {
        sidebar.style.left = "100%";   // lo oculta de nuevo
        button.textContent = "☰"; // vuelve a las tres rayas
        abierto = false;
    }
});

function cerrarsesion(){
    // Guardar cambios del usuario si hay
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    window.location.href="index.html";
}

// COMPARTIR RUTINA
function compartir(){
    window.location.href="compartir.html";
}
function home(){
    window.location.href="rutinas.html";
}
function progreso(){
    window.location.href="historial.html";
}

window.compartir = compartir;
window.home = home;
window.progreso = progreso;
window.cerrarsesion = cerrarsesion;
