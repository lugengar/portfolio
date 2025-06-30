// Leer JSON desde localStorage
function leerJSON(nombre) {
    const data = localStorage.getItem(nombre);
    return data ? JSON.parse(data) : [];
}

// Función para mostrar rutinas en pantalla
function mostrarRutinas() {
    const rutinas = leerJSON("rutinas");
    const ejercicios = leerJSON("ejercicios");

    const lista = document.getElementById("rutinas");
    let rutinaHTML = "";

    rutinas.forEach((item) => {
        const nombresEjercicios = item.ejercicios.map(ej => {
            const ejercicio = ejercicios.find(e => e.id === ej.id);
            return ejercicio ? ejercicio.nombre : "(desconocido)";
        }).join(", ");

        rutinaHTML += `
        <div class="rutina" id="rutina_${item.id}">
            <h2 class="subtitulo">${item.nombre}</h2>
            <button class="configuracion"></button>
            <p class="texto">
                - Días: ${obtenerdias(item.dias)}<br>
                - Ejercicios: ${nombresEjercicios}
            </p>
            <button class="boton">Empezar</button>
        </div>
        `;
    });

    lista.innerHTML += rutinaHTML;
}

function obtenerdias(dias) {
    return dias.join(", ");
}

// Ejecutar cuando se cargue la página
document.addEventListener("DOMContentLoaded", mostrarRutinas);
