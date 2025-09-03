// cloud.js
import { RUTINAS_ID, ENVIAR_ID, JSONBIN_KEY } from "./config.js";

// Función genérica para guardar datos en JSONBin
async function guardarJSONBin(binId, datos) {
    try {
        const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_KEY,
                "X-Bin-Versioning": "false"
            },
            body: JSON.stringify(datos)
        });
        const result = await res.json();
        console.log("Guardado exitoso:", result);
    } catch (error) {
        console.error("Error guardando en JSONBin:", error);
    }
}

// Guardar rutinas del usuario
export function guardarRutinasEnLaNube(usuario) {
    return guardarJSONBin(RUTINAS_ID, usuario.rutinas);
}

// Guardar rutina compartida
export function compartirRutinaEnLaNube(rutina) {
    return guardarJSONBin(ENVIAR_ID, rutina);
}
